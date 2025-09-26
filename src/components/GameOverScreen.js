import React, { useState } from 'react';
import './GameOverScreen.css';

const GameOverScreen = () => {
  const [selectedDate, setSelectedDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate()
  });
  const [horoscopeData, setHoroscopeData] = useState(null);
  const [userZodiac, setUserZodiac] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleRetry = () => {
    setShowResult(false);
    setHoroscopeData(null);
    setUserZodiac('');
  };

  // 별자리 계산 함수
  const getZodiacSign = (month, day) => {
    const signs = [
      { name: '염소자리', start: [12, 22], end: [1, 19] },
      { name: '물병자리', start: [1, 20], end: [2, 18] },
      { name: '물고기자리', start: [2, 19], end: [3, 20] },
      { name: '양자리', start: [3, 21], end: [4, 19] },
      { name: '황소자리', start: [4, 20], end: [5, 20] },
      { name: '쌍둥이자리', start: [5, 21], end: [6, 20] },
      { name: '게자리', start: [6, 21], end: [7, 22] },
      { name: '사자자리', start: [7, 23], end: [8, 22] },
      { name: '처녀자리', start: [8, 23], end: [9, 22] },
      { name: '천칭자리', start: [9, 23], end: [10, 22] },
      { name: '전갈자리', start: [10, 23], end: [11, 21] },
      { name: '사수자리', start: [11, 22], end: [12, 21] }
    ];

    for (let sign of signs) {
      const [startMonth, startDay] = sign.start;
      const [endMonth, endDay] = sign.end;
      
      if (startMonth === endMonth) {
        // 같은 달 내에서
        if (month === startMonth && day >= startDay && day <= endDay) {
          return sign.name;
        }
      } else {
        // 다른 달에 걸쳐 있는 경우 (염소자리)
        if ((month === startMonth && day >= startDay) || 
            (month === endMonth && day <= endDay)) {
          return sign.name;
        }
      }
    }
    return '양자리'; // 기본값
  };

  const getHoroscope = async () => {
    const zodiac = getZodiacSign(selectedDate.month, selectedDate.day);
    setUserZodiac(zodiac);
    
    try {
      const response = await fetch('/horoscope_2025-09-27_28.json');
      const data = await response.json();
      
      // 날짜에 따라 운세 데이터 선택 (27일 또는 28일)
      const targetDate = selectedDate.day <= 15 ? '2025-09-27' : '2025-09-28';
      const horoscope = data[targetDate][zodiac];
      
      setHoroscopeData(horoscope);
      setShowResult(true);
    } catch (error) {
      console.error('운세 데이터를 불러오는데 실패했습니다:', error);
      alert('운세 데이터를 불러오는데 실패했습니다.');
    }
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 100; i--) {
      years.push(i);
    }
    return years;
  };

  const generateMonths = () => {
    return Array.from({ length: 12 }, (_, i) => i + 1);
  };

  const generateDays = () => {
    const daysInMonth = new Date(selectedDate.year, selectedDate.month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };


  return (
    <div className="game-over-container">

      {/* 상단 텍스트 */}
      <div className="text-section">
        <img 
          src="/title.png" 
          alt="짐보와 함께하는 오늘의 운세" 
          className="title-image"
        />
      </div>

      {/* BAGSPACE 로고 */}
      <div className="character-section">
        <div className="logo-container">
          <img 
            src="/lucky_logo.png" 
            alt="Lucky Logo" 
            className="bagspace-logo"
          />
        </div>
      </div>

      {/* 생일 입력 섹션 */}
      <div className="birthday-section">
        <h3 className="birthday-title">생년월일을 입력해주세요</h3>
        <div className="scroll-picker-container">
          <div className="scroll-picker">
            <div className="picker-wheel" id="year-picker">
              {generateYears().map(year => (
                <div 
                  key={year} 
                  className={`picker-item ${selectedDate.year === year ? 'selected' : ''}`}
                  onClick={() => setSelectedDate({...selectedDate, year})}
                >
                  {year}년
                </div>
              ))}
            </div>
          </div>
          <div className="scroll-picker">
            <div className="picker-wheel" id="month-picker">
              {generateMonths().map(month => (
                <div 
                  key={month} 
                  className={`picker-item ${selectedDate.month === month ? 'selected' : ''}`}
                  onClick={() => setSelectedDate({...selectedDate, month})}
                >
                  {month}월
                </div>
              ))}
            </div>
          </div>
          <div className="scroll-picker">
            <div className="picker-wheel" id="day-picker">
              {generateDays().map(day => (
                <div 
                  key={day} 
                  className={`picker-item ${selectedDate.day === day ? 'selected' : ''}`}
                  onClick={() => setSelectedDate({...selectedDate, day})}
                >
                  {day}일
                </div>
              ))}
            </div>
          </div>
        </div>
        <button className="horoscope-button" onClick={getHoroscope}>
          운세 확인하기
        </button>
      </div>

      {/* 운세 결과 화면 */}
      {showResult && (
        <div className="horoscope-result">
          <div className="result-content">
            <div className="result-logo">
              <img 
                src="/lucky_logo2.png" 
                alt="Lucky Logo" 
                className="result-logo-image"
              />
            </div>
            <h3 className="zodiac-title">{userZodiac} 오늘의 운세</h3>
            <div className="horoscope-text">
              {horoscopeData}
            </div>
            <button className="retry-button" onClick={handleRetry}>
              다시 확인하기
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default GameOverScreen;
