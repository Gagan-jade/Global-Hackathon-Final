import React from 'react';
import styled from 'styled-components';

const Pattern = () => {
  return (
    <StyledWrapper>
      <div className="stars"></div>
      <div className="twinkling"></div>
      <div className="nebula"></div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  position: absolute;
  inset: 0;
  z-index: -1; /* Keeps it behind other elements */
  overflow: hidden;

  .stars, .twinkling, .nebula {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  /* Starry Background */
  .stars {
    background: url('https://www.transparenttextures.com/patterns/stardust.png');
    opacity: 0.5;
  }

  /* Twinkling effect */
  .twinkling {
    background: radial-gradient(circle, rgba(255,255,255,0.1) 10%, transparent 80%);
    animation: twinkle 4s infinite alternate ease-in-out;
  }

  /* Nebula effect */
  .nebula {
    background: radial-gradient(circle at 30% 30%, rgba(138, 43, 226, 0.3), transparent),
                radial-gradient(circle at 70% 70%, rgba(75, 0, 130, 0.3), transparent);
    mix-blend-mode: screen;
  }

  @keyframes twinkle {
    from { opacity: 0.2; }
    to { opacity: 0.8; }
  }
`;

export default Pattern;
