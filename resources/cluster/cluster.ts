import * as gcp from '@pulumi/gcp'
import { gcpProject, gcpRegion } from '../config'
import { gkeNetwork } from './compute-network'
import { gkeSubnet } from './subnet'

export const gkeCluster = new gcp.container.Cluster('gke-cluster', {
  addonsConfig: {
    dnsCacheConfig: {
      enabled: true,
    },
  },
  binaryAuthorization: {
    evaluationMode: 'PROJECT_SINGLETON_POLICY_ENFORCE',
  },
  datapathProvider: 'ADVANCED_DATAPATH',
  description: 'A GKE cluster',
  initialNodeCount: 1,
  ipAllocationPolicy: {
    clusterIpv4CidrBlock: '/14',
    servicesIpv4CidrBlock: '/20',
  },
  location: gcpRegion,
  masterAuthorizedNetworksConfig: {
    cidrBlocks: [
      {
        cidrBlock: '0.0.0.0/0',
        displayName: 'All networks',
      },
    ],
  },
  network: gkeNetwork.name,
  networkingMode: 'VPC_NATIVE',
  privateClusterConfig: {
    enablePrivateEndpoint: false,
    enablePrivateNodes: true,
    masterIpv4CidrBlock: '10.100.0.0/28',
  },
  releaseChannel: {
    channel: 'STABLE',
  },
  removeDefaultNodePool: true,
  subnetwork: gkeSubnet.name,
  workloadIdentityConfig: {
    workloadPool: `${gcpProject}.svc.id.goog`,
  },
})
