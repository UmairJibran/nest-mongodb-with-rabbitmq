export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  mongoDbUrl: process.env.MONGODB_URL,
  rabbitMQUrl: process.env.RABBITMQ_URL,
  reqresApiUrl: process.env.REQRES_API_BASE,
});
