import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

interface MediaItem {
    name: string;
    logo: string;
    link: string;
}

const MEDIA_LIST: MediaItem[] = [
    { name: 'news.vnanet.vn', logo: '/media/thong-tan-xa-viet-nam.gif', link: 'https://news.vnanet.vn/' },
    { name: 'vietnamplus.vn', logo: '/media/viet-nam-plus.gif', link: 'http://vietnamplus.vn/' },
    { name: 'vietnam.vnanet.vn', logo: '/media/bao-anh-viet-nam.gif', link: 'http://vietnam.vnanet.vn/VNP/vi-VN/1/Default.aspx' },
    { name: 'vietnamnews.vn', logo: '/media/viet-nam-news.gif', link: 'https://vietnamnews.vn/' },
    { name: 'vietnamlawmagazine.vn', logo: '/media/Logo__VLLF_in-Website__01.gif', link: 'http://vietnamlawmagazine.vn/' },
    { name: 'happyvietnam', logo: '/media/happyvietnam.jpg', link: 'https://happyvietnam.vnanet.vn/' },
    { name: 'bnews.vn', logo: '/media/logoBG.png', link: 'http://bnews.vn/' },
];

const MediaStrip: React.FC = () => {
    return (
        <section className="media-ttxvn">
            <style>{`
                .media-ttxvn {
                    width: 100%;
                    background: #fff;
                    margin-top: 20px;
                    border-top: 1px solid #e5e5e5;
                }
                .media-ttxvn .media-inner {
                    padding: 15px 0;
                }
                .media-ttxvn .media-title {
                    font-family: Roboto, sans-serif;
                    font-size: 14px;
                    font-weight: 700;
                    color: #363636;
                    background: #f6f6f6;
                    padding: 5px 10px;
                    display: inline-block;
                    text-transform: uppercase;
                    margin-bottom: 15px;
                }
                .media-ttxvn .swiper-slide {
                    width: auto !important;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .media-ttxvn img {
                    max-height: 75px;
                    width: auto;
                }
                /* Ensure smooth linear scrolling */
                .media-ttxvn .swiper-wrapper {
                    transition-timing-function: linear !important;
                }
            `}</style>
            <div className="media-inner">
                <h2><span className="media-title">Các đơn vị thông tin của TTXVN</span></h2>
                <Swiper
                    modules={[Autoplay]}
                    slidesPerView="auto"
                    spaceBetween={30}
                    loop={true}
                    speed={3000}
                    autoplay={{
                        delay: 0,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true
                    }}
                    allowTouchMove={false}
                    className="partner-swiper"
                >
                    {MEDIA_LIST.map((item, idx) => (
                        <SwiperSlide key={idx}>
                            <a href={item.link} target="_blank" rel="noopener noreferrer" title={item.name}>
                                <img src={item.logo} alt={item.name} />
                            </a>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default MediaStrip;
