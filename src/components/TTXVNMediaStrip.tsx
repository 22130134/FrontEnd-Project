import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

interface Partner {
    name: string;
    url: string;
    logo: string;
}

const PARTNERS: Partner[] = [
    { name: "news.vnanet.vn", url: "https://news.vnanet.vn/", logo: "https://baotintuc.vn/Images/thong-tan-xa-viet-nam.gif" },
    { name: "vietnamplus.vn", url: "http://vietnamplus.vn/", logo: "https://baotintuc.vn/Images/viet-nam-plus.gif" },
    { name: "vietnam.vnanet.vn", url: "http://vietnam.vnanet.vn/VNP/vi-VN/1/Default.aspx", logo: "https://baotintuc.vn/Images/bao-anh-viet-nam.gif" },
    { name: "lecourrier.vn", url: "https://lecourrier.vn/", logo: "https://baotintuc.vn/Images/Lecourrie.jpg" },
    { name: "vietnamnews.vn", url: "https://vietnamnews.vn/", logo: "https://baotintuc.vn/Images/viet-nam-news.gif" },
    { name: "vietnamlawmagazine.vn", url: "http://vietnamlawmagazine.vn/", logo: "https://baotintuc.vn/Images/Logo__VLLF_in-Website__01.gif" },
    { name: "happyvietnam", url: "https://happyvietnam.vnanet.vn/", logo: "https://baotintuc.vn/Images/happyvietnam.jpg" },
    { name: "sachthongtan.vn", url: "http://sachthongtan.vn/", logo: "https://baotintuc.vn/Images/logo-NXBTT.jpg" },
    { name: "bnews.vn", url: "http://bnews.vn/", logo: "https://baotintuc.vn/Images/logoBG.png" },
];

const TTXVNMediaStrip: React.FC = () => {
    return (
        <div className="content_bottom">
            <div className="partner" style={{ marginTop: '20px', borderTop: '1px solid #ddd', padding: '20px 0' }}>
                <h2 style={{
                    borderBottom: '1px solid #ccc',
                    lineHeight: '0.1em',
                    margin: '10px 0 20px',
                    textAlign: 'left' // Browsers usually center h2, but ref seems to have it left aligned text inside? 
                    // Ref HTML used .partner h2 span.txt background over border.
                }}>
                    <span className="txt" style={{
                        background: '#f6f6f6',
                        color: '#363636',
                        padding: '0 10px',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                    }}>
                        Các đơn vị thông tin của TTXVN
                    </span>
                </h2>

                <div style={{ marginTop: '20px' }}>
                    <Swiper
                        modules={[Autoplay]}
                        spaceBetween={20}
                        slidesPerView={5}
                        loop={true}
                        autoplay={{
                            delay: 2000,
                            disableOnInteraction: false,
                        }}
                        breakpoints={{
                            320: { slidesPerView: 2 },
                            640: { slidesPerView: 3 },
                            768: { slidesPerView: 4 },
                            1024: { slidesPerView: 5 },
                        }}
                        className="list-partner"
                    >
                        {PARTNERS.map((p, idx) => (
                            <SwiperSlide key={idx}>
                                <div className="partner-item" style={{ textAlign: 'center' }}>
                                    <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
                                        <img
                                            src={p.logo}
                                            alt={p.name}
                                            style={{
                                                maxWidth: '100%',
                                                height: 'auto',
                                                maxHeight: '60px', /* Constraint height as per typical partner logos */
                                                display: 'inline-block'
                                            }}
                                        />
                                    </a>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>

            <style>{`
               .partner h2 {
                   width: 100%; 
                   text-align: center; 
                   border-bottom: 1px solid #ccc; 
                   line-height: 0.1em; 
                   margin: 10px 0 20px; 
               } 
               .partner h2 span { 
                    background:#fff; /* Adjust if background is not white */
                    padding:0 10px; 
               }
            `}</style>
        </div>
    );
};

export default TTXVNMediaStrip;
