#!/usr/bin/python
import sys
from stepper import *
import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)
#Setup servo
servo_pin = 12
GPIO.setup(12, GPIO.OUT)
servo = GPIO.PWM(servo_pin, 50)
pulse = 5
servo.start(pulse)

#Setup linear motors
lin_pins = [19, 13]

GPIO.setup(lin_pins[0], GPIO.OUT)
GPIO.setup(lin_pins[1], GPIO.OUT)
init_stepper()

lin = (GPIO.PWM(13, 50), GPIO.PWM(18, 50))
lin[0].start(pulse)
lin[1].start(pulse)



# 0 deg = 0.5 ms = 2.5%
# 90 deg = 1.5 ms = 7.5%
# 180 deg = 2.5 ms = 12.5%
degree = (12.5 - 2.5)/180 # pwm pulse variation per degree
signal = lambda angle: (2.5 + (degree * angle))

servo_positions = list(range(180, 0, -30))
lin_positions = [0, 180]

def move_linear(lin_id):
	turn_stepper(1)
	time.sleep(1)
	lin[lin_id].ChangeDutyCycle(signal(lin_positions[0]))
	time.sleep(1)
	lin[lin_id].ChangeDutyCycle(signal(lin_positions[1]))
	time.sleep(1)

def turn_to_pos(pos):
	servo.ChangeDutyCycle(signal(servo_positions[pos]))
	time.sleep(1)

aromas = [ int(y) for y in list(sys.argv[1]) ]

if(aromas[0] == 1):
	turn_to_pos(0)
#	time.sleep(1)
	move_linear(0)
	time.sleep(1)
if(aromas[1] == 1):
	turn_to_pos(1)
	#time.sleep(1)
	move_linear(0)
	time.sleep(1)
if(aromas[2] == 1):
	turn_to_pos(2)
#	time.sleep(1)
	move_linear(0)
	time.sleep(1)
if(aromas[3] == 1):
	turn_to_pos(2)
#	time.sleep(1)
	move_linear(1)
	time.sleep(1)
if(aromas[4] == 1):
	turn_to_pos(1)
#	time.sleep(1)
	move_linear(1)
	time.sleep(1)
if(aromas[5] == 1):
	turn_to_pos(0)	
#	time.sleep(1)
	move_linear(1)
	time.sleep(1)

servo.stop()
