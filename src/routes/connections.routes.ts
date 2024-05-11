import { Router } from 'express';
import { ConnectionsController } from '../controllers/ConnectionsController';

const connectionsRoutes = Router();
const connectionsController = new ConnectionsController();

connectionsRoutes.post('/', connectionsController.create);
connectionsRoutes.get('/', connectionsController.index);
export default connectionsRoutes;