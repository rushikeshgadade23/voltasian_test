import { validateInstallation } from './src/validations/installation.validation.js';

const testData = {
  ticket: 't1',
  customer: 'c1',
  technician: 'tech1',
  product: { name: 'Voltasion Pro', model: 'VSP-10', serialNumber: 'SN-001', manufacturer: 'Voltasion' },
  installationDate: '2023-01-01T10:00',
};

const errors = validateInstallation(testData);
console.log('Errors:', JSON.stringify(errors));
