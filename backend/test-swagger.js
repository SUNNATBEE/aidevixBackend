const swaggerSpec = require('./backend/config/swagger');
console.log(Object.keys(swaggerSpec.paths).length);
console.log(swaggerSpec.paths['/health'] ? 'Has health' : 'No health');
console.log(swaggerSpec.paths['/api/auth/register'] ? 'Has register' : 'No register');
