import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Cardproduct from './Cardproduct';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';





const arrowStyle = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 2,
    width: '35px',
    height: '35px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 202, 87, 0.84)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
};

const NextArrow = ({ onClick }) => (
    <div
        style={{ ...arrowStyle, right: '-15px' }}
        onClick={onClick}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#035928ff'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#00ca57'}
    >
        <FaArrowRight />
    </div>
);

const PrevArrow = ({ onClick }) => (
    <div
        style={{ ...arrowStyle, left: '-15px' }}
        onClick={onClick}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#035928ff'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#00ca57'}
    >
        <FaArrowLeft />
    </div>
);


function CustomSlider({ title, data = [], CardComponent = Cardproduct, slidesToShow = 5, autoplay, }) {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow,
        slidesToScroll: 1,
        autoplay,
        autoplaySpeed: 1000,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 4 } },
            { breakpoint: 768, settings: { slidesToShow: 3 } },
            { breakpoint: 480, settings: { slidesToShow: 2 } }
        ]
    };

    return (
        <div className='mb-4 position-relative container'>
            {title && <h2 className='mb-3'>{title}</h2>}
            <Slider {...settings}>
                {data.map((item, index) => (
                    <div key={index}>
                        <CardComponent data={item} />
                    </div>

                ))}
            </Slider>
        </div>
    );
}

export default CustomSlider;
