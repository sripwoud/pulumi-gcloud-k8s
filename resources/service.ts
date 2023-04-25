import * as k8s from '@pulumi/kubernetes'
import { isMinikube } from './config'
import { appLabels, appName, deployment } from './deployment'

// Allocate an IP to the Deployment.
export const frontend = new k8s.core.v1.Service(appName, {
  metadata: { labels: deployment.spec.template.metadata.labels },
  spec: {
    ports: [{ port: 80, protocol: 'TCP', targetPort: 80 }],
    selector: appLabels,
    type: isMinikube ? 'ClusterIP' : 'LoadBalancer',
  },
})
