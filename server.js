// Dependencies
import { Hub } from '@anephenix/hub';

// Initialize hub to listen on port 4000
const hub = new Hub({ port: 4000 });

// Start listening
hub.listen();