import Appointment from '../models/Appointments';
import User from '../models/User';
import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';

class ScheduleController {
  async index(req, res) {
    // check if user is provider
    const checkUserProvider = await User.findOne({ where: { id: req.userId, provider: true } });
    if (!checkUserProvider) { res.status(401).json({ error: 'user is not provider' }); }

    const { date } = req.query;
    const parseDate = parseISO(date);

    const appointment = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [
            startOfDay(parseDate),
            endOfDay(parseDate)
          ]
        }
      },
      order: ['date']
    })

    res.json(appointment)
  }
}
export default new ScheduleController();