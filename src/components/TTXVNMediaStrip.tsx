import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

type MediaItem = {
    name: string;
    logo: string;
    link: string;
};

const MEDIA_LIST: MediaItem[] = [
    { name: 'baoanhvietnam.vn', logo: '/media/bao-anh-viet-nam.gif', link: 'https://vietnam.vnanet.vn/vietnamese' },
    { name: 'vietnamplus.vn', logo: '/media/viet-nam-plus.gif', link: 'https://www.vietnamplus.vn' },
    { name: 'NXB Thông Tấn', logo: '/media/logo-NXBTT.jpg', link: 'https://sachthongtan.vn' },
    { name: 'Le Courrier du Vietnam', logo: '/media/lecourrier.jpg', link: 'https://lecourrier.vn' },
    { name: 'Vietnam News', logo: '/media/viet-nam-news.gif', link: 'https://vietnamnews.vn' },
    { name: 'Vietnam Law & Legal Forum', logo: '/media/Logo__VLLF_in-Website__01.gif', link: 'https://vietnamlawmagazine.vn' },
    { name: 'Happy Vietnam', logo: '/media/happyvietnam.jpg', link: 'https://happyvietnam.vnanet.vn/' },
    { name: 'Bnews', logo: '/media/logoBG.png', link: 'https://bnews.vn' },
    { name: 'News VNA', logo: '/media/thong-tan-xa-viet-nam.gif', link: 'https://news.vnanet.vn' },
];

const TTXVNMediaStrip: React.FC = () => {
    return (
        <section className="media-ttxvn">
            <div className="media-inner">
                <div className="media-title">Các đơn vị thông tin của TTXVN</div>

                <Swiper
                    modules={[Autoplay]}
                    slidesPerView="auto"
                    spaceBetween={18}
                    loop
                    speed={6000}
                    autoplay={{
                        delay: 0,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    allowTouchMove={false}
                    className="media-swiper"
                >
                    {MEDIA_LIST.concat(MEDIA_LIST).map((item, i) => (
                        <SwiperSlide key={i} className="media-slide">
                            <a href={item.link} target="_blank" rel="noreferrer" title={item.name}>
                                <img src={item.logo} alt={item.name} />
                            </a>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default TTXVNMediaStrip;
