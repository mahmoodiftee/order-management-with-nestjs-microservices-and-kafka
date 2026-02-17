![My local image](assets/flow-diagram.png)

## Future Pro-Tips: What to keep in mind

- Semantic Choice: If the Gateway doesn't need to know if the microservice finished successfully (e.g., "Order Created", "Log Event"), always use emit + @EventPattern. It's much faster and simpler.
- Topic Creation: Kafka doesn't always auto-create topics. If your code isn't receiving messages, check if the topic exists: docker-compose exec kafka kafka-topics.sh --list --bootstrap-server localhost:9092.
- DTOs: As you add more features, use shared DTOs (Data Transfer Objects) across your apps to ensure the Payload being sent by the Gateway matches what the Microservice expects.
- Error Handling: With emit, if the microservice crashes while processing, the Gateway won't know. Make sure your microservices have internal retries or dead-letter queues if the data is mission-critical.

- curl command for testing
`curl -v -X POST http://localhost:3000/api/order -H "Content-Type: application/json" -d '{"productId": "123", "quantity": 1, "price": 199.98}'`
