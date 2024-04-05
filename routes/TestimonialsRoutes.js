const routerTestimonial = require("express").Router();
const {createTestimonial, getTestimonialsData} = require('../controller/TestimonialDataController')
const apicache = require('apicache');
const cache = apicache.middleware;
routerTestimonial.post("/insertTestimonData", createTestimonial);
routerTestimonial.get("/getTestimonData", cache('5 minutes'), getTestimonialsData)

module.exports = routerTestimonial; 