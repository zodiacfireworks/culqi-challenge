import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const observabilityAgent = require('newrelic');

@Injectable()
export class ObservabilityInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const interceptor = this;

        return observabilityAgent.startWebTransaction(
            context.getHandler().name,
            () => {
                const transaction = interceptor.getTransaction();
                return next.handle().pipe(
                    tap(() => {
                        return interceptor.endTransaction(transaction);
                    }),
                );
            },
        );
    }

    getTransaction(): any {
        return observabilityAgent.getTransaction();
    }

    endTransaction(transaction: any): any {
        return transaction.end();
    }
}
