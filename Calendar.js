import React, { useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedStartTime, setSelectedStartTime] = useState(null);
    const [selectedEndTime, setSelectedEndTime] = useState(null);
    const [eventTitle, setEventTitle] = useState('');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [error, setError] = useState('')
    const handleSelectedInfo = (slotInfo) => {
        setShowModal(true);
        setSelectedDate(slotInfo.start);
        setSelectedStartTime(slotInfo.start); // Set selected start time
        setSelectedEndTime(moment(slotInfo.start).add(1, 'hours').toDate()); // Set selected end time (1 hour after start time)
        setSelectedEvent(null); // Reset selected event
    };

    const saveEvent = () => {
        if (eventTitle && selectedDate && selectedStartTime && selectedEndTime) {
            const newEvent = {
                title: eventTitle,
                start: selectedStartTime,
                end: selectedEndTime
            };
            setEvents([...events, newEvent]); // Update events state
            setShowModal(false);
            setEventTitle('');
            setSelectedStartTime(null); // Reset selected start time
            setSelectedEndTime(null); // Reset selected end time
            setSelectedDate(''); // Reset selected date
        } else {
            setError('eneter value')
        }
    };

    const deleteEvent = () => {
        if (selectedEvent) {
            setEvents(events.filter(event => event !== selectedEvent));
            setShowModal(false);
        }
    };

    const updateEvent = () => {
        if (selectedEvent && eventTitle && selectedDate && selectedStartTime && selectedEndTime) {
            const updatedEvent = {
                ...selectedEvent,
                title: eventTitle,
                start: selectedStartTime,
                end: selectedEndTime
            };
            const updatedEvents = events.map(event => event === selectedEvent ? updatedEvent : event);
            setEvents(updatedEvents);
            setShowModal(false);
            setEventTitle('');
            setSelectedStartTime(null); // Reset selected start time
            setSelectedEndTime(null); // Reset selected end time
            setSelectedDate(''); // Reset selected date
        }
    };

    return (
    
            <div style={{ height: '90vh', backgroundColor: 'white' }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ padding: '10px', cursor: 'pointer' }}
                    selectable={true}
                    onSelectSlot={handleSelectedInfo}
                    onSelectEvent={(event) => {
                        setSelectedEvent(event);
                        setSelectedDate(event.start);
                        setSelectedStartTime(event.start);
                        setSelectedEndTime(event.end);
                        setEventTitle(event.title);
                        setShowModal(true);
                    }}
                    eventPropGetter={(event, start, end, isSelected) => {
                        const backgroundColor = event.color ? event.color : '#3174ad';
                        const style = {
                            backgroundColor: backgroundColor,
                            borderRadius: '0px',
                            opacity: 0.8,
                            color: 'white',
                            border: '0px',
                            display: 'block',
                            padding: '0px',
                            paddingLeft: '3px',
                            paddingTop: '3px',
                            cursor: 'pointer'
                        };
                        return { style: style };
                    }}
                    components={{
                        event: ({ event }) => (
                            <div>
                                <div>Start: {moment(event.start).format('hh:mm A')}</div>
                                <div>End: {moment(event.end).format('hh:mm A')}</div>
                                {/* <div>{event.title}</div> */}
                            </div>
                        )
                    }}
                />

                {showModal && (
                    <div className="modal" style={{ display: 'block', position: 'fixed', left: '0', right: '0', bottom: '0', top: '0' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{selectedEvent ? 'Update Event' : 'Add Event'}</h5>
                                    <button type="button" style={{ border: 'none', backgroundColor: 'white', fontSize: '1.5rem',position:'absolute',right:'0',top:'0' }} onClick={() => setShowModal(false)}>
                                        <span onClick={() => setError('')}>X</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <label>Event Title</label>
                                    <input
                                        type='text'
                                        className='form-control'
                                        id='eventTitle'
                                        value={eventTitle}
                                        onChange={(e) => setEventTitle(e.target.value)}
                                    />
                                    <span className='text-danger'>{error}</span>
                                    <div>
                                        <label>Start Date and Time</label>
                                        <input
                                            type="datetime-local"
                                            className="form-control"
                                            value={selectedStartTime ? moment(selectedStartTime).format('YYYY-MM-DDTHH:mm') : ''}
                                            onChange={(e) => setSelectedStartTime(moment(e.target.value, 'YYYY-MM-DDTHH:mm').toDate())}
                                        />
                                    </div>
                                    <div>
                                        <label>End Date and Time</label>
                                        <input
                                            type="datetime-local"
                                            className="form-control"
                                            value={selectedEndTime ? moment(selectedEndTime).format('YYYY-MM-DDTHH:mm') : ''}
                                            onChange={(e) => setSelectedEndTime(moment(e.target.value, 'YYYY-MM-DDTHH:mm').toDate())}
                                        />
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    {selectedEvent && (
                                        <button type="button" className="btn btn-danger" onClick={deleteEvent}>Delete</button>
                                    )}
                                    <button type="button" className="btn btn-primary" onClick={selectedEvent ? updateEvent : saveEvent}>
                                        {selectedEvent ? 'Update' : 'Save'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        
    );
};

export default CalendarComponent;
