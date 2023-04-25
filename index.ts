import './resources'
import * as pulumi from '@pulumi/pulumi'
import {
  deployment,
  frontend,
  gkeCluster,
  gkeNetwork,
  isMinikube,
} from './resources'

export const kubeconfig = pulumi.interpolate`apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: ${gkeCluster.masterAuth.clusterCaCertificate}
    server: https://${gkeCluster.endpoint}
  name: ${gkeCluster.name}
contexts:
- context:
    cluster: ${gkeCluster.name}
    user: ${gkeCluster.name}
  name: ${gkeCluster.name}
current-context: ${gkeCluster.name}
kind: Config
preferences: {}
users:
- name: ${gkeCluster.name}
  user:
    exec:
      apiVersion: client.authentication.k8s.io/v1beta1
      command: gke-gcloud-auth-plugin
      installHint: Install gke-gcloud-auth-plugin for use with kubectl by following
        https://cloud.google.com/blog/products/containers-kubernetes/kubectl-auth-changes-in-gke
      provideClusterInfo: true
`
export const networkName = gkeNetwork.name
export const networkId = gkeNetwork.id
export const clusterName = gkeCluster.name
export const clusterId = gkeCluster.id
export const deploymentName = deployment.metadata.name
// When "done", this will print the public IP.
export const ip = isMinikube
  ? frontend.spec.clusterIP
  : frontend.status.loadBalancer.apply(
      (lb) => lb.ingress[0].ip ?? lb.ingress[0].hostname,
    )
