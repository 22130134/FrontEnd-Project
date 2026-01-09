import React, { useState, useEffect } from 'react';

const EVENTS = [
    "Đại hội XIV của Đảng",
    "Bầu cử Quốc hội khóa XVI và HĐND 2026-2031",
    "SEA Games 33",
    "Đại hội Thi đua yêu nước toàn quốc lần thứ XI"
];

const EventBar: React.FC = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Format: Thứ 6, 9/1/2026 | 5:03:37
    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const dayName = days[currentTime.getDay()];
    const dateStr = currentTime.toLocaleDateString('vi-VN');
    const timeStr = currentTime.toLocaleTimeString('vi-VN', { hour12: false });

    return (
        <div className="event-bar" style={{ backgroundColor: '#f5f5f5', borderBottom: '1px solid #ddd', fontFamily: 'Roboto, sans-serif' }}>
            <div className="content_wrapper w1040" style={{ display: 'flex', alignItems: 'center', height: '40px', justifyContent: 'space-between', fontSize: '14px' }}>

                {/* Left: Label + List */}
                <div style={{ display: 'flex', alignItems: 'center', overflow: 'hidden', flex: 1 }}>
                    <span style={{
                        color: '#b5272d',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        marginRight: '15px',
                        whiteSpace: 'nowrap'
                    }}>
                        Sự kiện
                    </span>

                    <div className="event-list" style={{ display: 'flex', gap: '10px', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {EVENTS.map((event, idx) => (
                            <span key={idx} className="event-pill" style={{
                                backgroundColor: '#fff',
                                padding: '3px 12px',
                                borderRadius: '15px',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                border: '1px solid #eee',
                                fontSize: '13px',
                                color: '#333'
                            }}>
                                {event}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Right: Date Time */}
                <div className="time-display" style={{ marginLeft: '20px', color: '#555', fontSize: '13px', whiteSpace: 'nowrap', fontWeight: '500' }}>
                    {dayName}, {dateStr} | {timeStr}
                </div>
            </div>

            <style>{`
                .event-list::-webkit-scrollbar { display: none; }
                .event-pill:hover {
                    background-color: #b5272d !important;
                    color: #fff !important;
                    border-color: #b5272d !important;
                }
            `}</style>
        </div>
    );
};

export default EventBar;
