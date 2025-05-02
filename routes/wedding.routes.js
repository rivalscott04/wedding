const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guest.controller');

// Guest routes
router.get('/guests', guestController.getAllGuests);
router.get('/guests/stats', guestController.getAttendanceStats);
router.get('/guests/:id', guestController.getGuestById);
router.get('/guests/slug/:slug', guestController.getGuestBySlug);
router.post('/guests', guestController.createGuest);
router.put('/guests/:id', guestController.updateGuest);
router.put('/guests/:id/attend', guestController.markAttended);
router.delete('/guests/:id', guestController.deleteGuest);

module.exports = router;
