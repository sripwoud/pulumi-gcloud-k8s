import * as k8s from '@pulumi/kubernetes'
import { namespace, provider } from './cluster'

export const appName = 'nginx'
export const labels = { app: appName }

export const deployment = new k8s.apps.v1.Deployment(
  'nginx',
  {
    spec: {
      replicas: 1,
      selector: { matchLabels: labels },
      template: {
        metadata: { labels, namespace },
        spec: { containers: [{ image: 'nginx', name: 'nginx' }] },
      },
    },
  },
  { provider },
)
