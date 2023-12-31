#! /bin/bash
# ---------------------------------------------------------------------------- #
# Required variables
# ---------------------------------------------------------------------------- #
# Load variables
source .env

# ---------------------------------------------------------------------------- #
# Create EKS cluster
# ---------------------------------------------------------------------------- #
# Create EKS cluster
cat eks-cluster.yaml | envsubst | eksctl create cluster -f -

# ---------------------------------------------------------------------------- #
# Namespace
# ---------------------------------------------------------------------------- #
kubectl create namespace ${EKS_NAMESPACE_NAME}

# ---------------------------------------------------------------------------- #
# Deployments
# ---------------------------------------------------------------------------- #
cat manifest.yaml | envsubst | kubectl apply -f - -n ${EKS_NAMESPACE_NAME}
