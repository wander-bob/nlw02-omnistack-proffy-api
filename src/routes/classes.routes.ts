import {Router} from 'express';
import { ClassesController } from '../controllers/ClassesController';

const classesRoutes = Router();
const classesControler = new ClassesController();

classesRoutes.post('/', classesControler.create);
classesRoutes.get('/', classesControler.index);

export default classesRoutes;