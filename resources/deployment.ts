import * as k8s from '@pulumi/kubernetes'

export const appName = 'nginx'
export const appLabels = { app: appName }

export const deployment = new k8s.apps.v1.Deployment('nginx', {
  spec: {
    replicas: 1,
    selector: { matchLabels: appLabels },
    template: {
      metadata: { labels: appLabels },
      spec: { containers: [{ image: 'nginx', name: 'nginx' }] },
    },
  },
})
