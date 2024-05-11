import { Request, Response} from 'express';
import db from '../database/connection';
import { convertHourToMinutes } from '../utils/convertHourToMinutes';

interface scheduleItemProps {
  week_day: number;
  from: string;
  to: string;
}
export class ClassesController {
  async index(request: Request, response: Response){
    const filters = request.query;
    if(!filters.week_day || !filters.subject || !filters.time){
      return response.status(400).json({
        error: 'Missing filters to search classes'
      })
    };
    const timeInMinutes = convertHourToMinutes(filters.time as string);
    const classes = await db('classes')
    .whereExists(function(){
      this.select('class_schedule.*')
      .from('class_schedule')
      .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
      .whereRaw('`class_schedule`.`week_day` = ??', [Number(filters.week_day)])
      .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
      .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes])
    })
    .where('subject', filters.subject)
    .join('users', 'classes.user_id', 'users.id')
    .select(['classes.*', 'users.*']);
    return response.json(classes)
  }
  async create (request: Request, response: Response){
    const {name, avatar, whatsapp, bio, cost, subject, schedule} = request.body;
    const trx = await db.transaction();
    
    try {
      const [user_id,] = await trx("users").insert({
        name, avatar, whatsapp, bio
      });
    
      const [class_id,] = await trx('classes').insert({
        subject, cost, user_id
      });
      const classSchedule = schedule.map((scheduleItem: scheduleItemProps)=>{
        
      return {
          week_day: scheduleItem.week_day,
          from: convertHourToMinutes(scheduleItem.from),
          to: convertHourToMinutes(scheduleItem.to),
          class_id
        }
      })
      
      await trx('class_schedule').insert(classSchedule);
      await trx.commit();
    
      return response.status(201).send();
    } catch (error) {
      trx.rollback();
      console.log(error);
      return response.status(400).json({message: 'Unexpected error in class creating. Please, review your input'});
    }
  }
}
