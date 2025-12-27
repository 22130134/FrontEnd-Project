import React from 'react';

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
                    overflow: hidden;
                }

                .media-ttxvn .media-title {
                    font-family: Roboto, sans-serif;
                    font-size: 13px;
                    font-weight: 700;
                    color: #111;
                    background: #f6f6f6;
                    padding: 5px 10px;
                    display: inline-block;
                    text-transform: uppercase;
                    margin-bottom: 10px;
                }

                /* ===== MARQUEE ===== */
                .media-ttxvn .marquee {
                    width: 100%;
                    overflow: hidden;
                }

                .media-ttxvn .marquee-track {
                    display: flex;
                    align-items: center;
                    gap: 30px;
                    width: max-content;
                    animation: media-marquee 25s linear infinite;
                }

                .media-ttxvn .marquee-track a {
                    display: flex;
                    align-items: center;
                }

                .media-ttxvn img {
                    height: 38px;
                    width: auto;
                    object-fit: contain;
                    opacity: 0.95;
                    filter: grayscale(10%);
                    transition: transform .2s ease, filter .2s ease;
                }

                .media-ttxvn a:hover img {
                    filter: none;
                    transform: scale(1.05);
                }

                .media-ttxvn .marquee:hover .marquee-track {
                    animation-play-state: paused;
                }

                @keyframes media-marquee {
                    from {
                        transform: translateX(0);
                    }
                    to {
                        transform: translateX(-50%);
                    }
                }
            `}</style>

            <div className="media-inner w1040">
                <h2>
                    <span className="media-title">
                        Các đơn vị thông tin của TTXVN
                    </span>
                </h2>

                <div className="marquee">
                    <div className="marquee-track">
                        {[...MEDIA_LIST, ...MEDIA_LIST].map((item, idx) => (
                            <a
                                key={idx}
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={item.name}
                            >
                                <img src={item.logo} alt={item.name} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MediaStrip;
