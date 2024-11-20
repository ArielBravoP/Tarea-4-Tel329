'use strict';
const { EventHubConsumerClient } = require('@azure/event-hubs');

// Connection string of the IoT Hub-compatible endpoint.
const connectionString = '';
const consumerGroup = EventHubConsumerClient.defaultConsumerGroupName; 

const client = new EventHubConsumerClient(consumerGroup, connectionString);

async function receiveMessages() {
    console.log('Esperando datos del middleware...');

    let messageCounter = 1; // Contador para los mensajes procesados

    // se configura el metodo de proceso de mensajes
    const subscription = client.subscribe({
        processEvents: async (events, context) => {
            for (const event of events) {
                const messageId = Math.floor(Math.random() * 1000000);

                // Imprimir detalles del mensaje
                console.log(`\nMensaje procesado #${messageCounter++}:`, event.body);
                console.log('Propiedades:', event.properties);
                console.log('Detalles del Sistema:', event.systemProperties);

                // Mensaje INFO de confirmación
                console.log(`INFO: Mensaje ${messageId} procesado exitosamente.`);
            }
        },
        processError: async (err, context) => {
            console.error('Error al recibir mensajes:', err);
        }
    });

    // Mantiene la suscripción activa hasta que se detenga manualmente.
    setTimeout(async () => {
        await subscription.close();
        console.log('Suscripción cerrada.');
    }, 60000 * 10);
}

receiveMessages().catch((err) => {
    console.error('Error al recibir mensajes:', err);
});