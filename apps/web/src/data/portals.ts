import type { Portal } from 'src/types/portal';

export const portals: Portal[] = [
  {
    id: 'general-support',
    title: 'General Support',
    description:
      'Get help with general questions, troubleshooting, or any issues not covered by other categories.',
    icon: 'mdi:lifebuoy',
    color: '#6449cc',
    href: '/tickets/new?portal=general-support',
  },
  {
    id: 'bug-report',
    title: 'Bug Report',
    description:
      'Report a bug or unexpected behavior you encountered while using the platform.',
    icon: 'mdi:bug-outline',
    color: '#ef4444',
    href: '/tickets/new?portal=bug-report',
  },
  {
    id: 'feature-request',
    title: 'Feature Request',
    description:
      'Suggest a new feature or improvement to help us make the product better for you.',
    icon: 'mdi:lightbulb-outline',
    color: '#f59e0b',
    href: '/tickets/new?portal=feature-request',
  },
  {
    id: 'account-access',
    title: 'Account & Access',
    description:
      'Need help with your account, permissions, login issues, or user management.',
    icon: 'mdi:shield-account-outline',
    color: '#3b82f6',
    href: '/tickets/new?portal=account-access',
  },
  {
    id: 'billing',
    title: 'Billing',
    description:
      'Questions about invoices, payments, subscription plans, or billing-related inquiries.',
    icon: 'mdi:credit-card-outline',
    color: '#22c55e',
    href: '/tickets/new?portal=billing',
  },
  {
    id: 'onboarding',
    title: 'Onboarding',
    description:
      'Get assistance with setting up your workspace, integrations, and initial configuration.',
    icon: 'mdi:rocket-launch-outline',
    color: '#8b5cf6',
    href: '/tickets/new?portal=onboarding',
  },
];

export function getPortalById(id: string): Portal | undefined {
  return portals.find((p) => p.id === id);
}
