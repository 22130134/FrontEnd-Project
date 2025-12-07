import {useEffect, useState} from "react";
import {useParams, Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store";
import {fetchNewsByCategory, clearNews} from "../store/newsSlice";
import NewsList from "./NewsList";
import StateView from "./StateView";
import TopNews from "./TopNews";
import CategoryLayout from './CategoryLayout';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import {
    CATEGORIES,
    fetchAllSections,
    fetchSections,
    NewsItem,
    HomeSection,
    MULTIMEDIA_SECTIONS
} from "../services/rssService";
import CategoryBlock from "./CategoryBlock";

interface SectionData extends HomeSection {
    items: NewsItem[];
    error: string | null;
}

function NewsFeed() {
    const {categoryId} = useParams();
    const dispatch = useDispatch<AppDispatch>();

    const activeCategory = categoryId || 'home';

    // Redux State
    const {items: news, loading, error} = useSelector((state: RootState) => state.news);
    const [retryKey, setRetryKey] = useState(0);

    // Local State for Home Sections
    const [homeSections, setHomeSections] = useState<SectionData[]>([]);
    const [multimediaSections, setMultimediaSections] = useState<SectionData[]>([]);

    useEffect(() => {
        // Redux fetch for main list / hero (Tin mới nhất)
        const category = CATEGORIES.find((c) => c.id === activeCategory);
        if (category) {
            dispatch(fetchNewsByCategory({url: category.url, categoryId: activeCategory}));
        } else {
            dispatch(clearNews());
        }

        // Local fetch for Home Sections (only on Home)
        if (activeCategory === 'home') {
            // Fetch Content Center Sections
            fetchAllSections().then(data => {
                setHomeSections(data);
            });

            // Fetch Multimedia Sections
            fetchSections(MULTIMEDIA_SECTIONS).then(data => {
                setMultimediaSections(data);
            });
        } else {
            setHomeSections([]);
            setMultimediaSections([]);
        }

    }, [activeCategory, retryKey, dispatch]);

    // Data partitioning
    const topNewsItems = news.slice(0, 6);

    // Multimedia items: Source specifically from Video RSS
    const videoSection = multimediaSections.find(s => s.id === 'video');
    const contentTopItems = videoSection ? videoSection.items : [];

    // Category Page:
    const categoryFeedItems = news;

    const showLoading = loading && news.length === 0;

    if (showLoading) {
        return (
            <div className="container" style={{padding: "40px 0", minHeight: "50vh"}}>
                <StateView state="loading" title="Đang tải tin tức..." message="Vui lòng chờ một chút."/>
            </div>
        );
    }

    if (error && news.length === 0) {
        return (
            <div className="container" style={{padding: "40px 0", minHeight: "50vh"}}>
                <StateView
                    state="error"
                    title="Không tải được tin tức"
                    message="Vui lòng thử lại. Nếu vẫn lỗi, có thể dịch vụ RSS đang gặp sự cố."
                    retryText="Thử lại"
                    onRetry={() => setRetryKey((k) => k + 1)}
                />
            </div>
        );
    }

    // Helper for images
    const getImage = (item: NewsItem) => {
        // 1. Check enclosure: ensure it's an image. If it's a video (mp4, etc), do NOT use as image.
        if (item.enclosure && item.enclosure.link) {
            const ext = item.enclosure.link.split('.').pop()?.toLowerCase();
            if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
                return item.enclosure.link;
            }
        }

        let image = item.thumbnail;

        const isValidImage = (url: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url);

        if (!image || !isValidImage(image)) {
            const pattern = /src=["']([^"']+)["']/;
            const descMatch = item.description?.match(pattern);
            const contentMatch = item.content?.match(pattern);

            const potentialImage = descMatch ? descMatch[1] : (contentMatch ? contentMatch[1] : '');

            if (potentialImage && isValidImage(potentialImage)) {
                image = potentialImage;
            } else if (potentialImage && (potentialImage.includes('youtube.com') || potentialImage.includes('youtu.be'))) {
                const ytMatch = potentialImage.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/);
                if (ytMatch) {
                    image = `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
                }
            }
        }

        if (!image) {
            return 'https://placehold.co/400x250/e0e0e0/999999?text=VIDEO';
        }

        // Fix for blocked video-api images using weserv.nl proxy
        if (image.includes('video-api.baotintuc.vn')) {
            return `https://images.weserv.nl/?url=${encodeURIComponent(image.replace('https://', ''))}`;
        }

        return image;
    };
    const cleanTitle = (t: string) => t?.replace(/<[^>]+>/g, '').trim();

    // Partition Data for Render
    const tinNongSection = homeSections.find(s => s.id === 'thoi-su');
    const tinNongItems = tinNongSection ? tinNongSection.items.slice(0, 5) : [];

    // Left Column
    const leftColumnSections = homeSections.filter(s =>
        ['thoi-su', 'the-gioi', 'kinh-te', 'xa-hoi', 'phap-luat'].includes(s.id)
    );

    // Right Column
    const rightColumnSections = homeSections.filter(s =>
        ['van-hoa', 'the-thao', 'giao-duc', 'y-te', 'quan-su', 'khoa-hoc'].includes(s.id)
    );

    // Doanh Nghiệp (Bottom)
    const doanhNghiepSection = homeSections.find(s => s.id === 'kinh-te');

    // Render Logic
    return (
        <>
            {/* 1. TOP NEWS (Home Only) */}
            {activeCategory === 'home' && (
                <TopNews items={topNewsItems}/>
            )}

            <main className="home-content" style={{minHeight: '60vh', paddingBottom: '40px'}}>
                <div className="content_wrapper w1040">

                    {/* 2. Category Header (Sub-pages Only) */}
                    {activeCategory !== 'home' && (
                        <div className="category-header">
                            <h2 className="page-title" style={{
                                margin: '20px 0',
                                color: '#d21d21',
                                borderBottom: '1px solid #ddd',
                                paddingBottom: '10px',
                                textTransform: 'uppercase',
                                fontFamily: 'Roboto-Bold, sans-serif'
                            }}>
                                {CATEGORIES.find(c => c.id === activeCategory)?.name}
                            </h2>
                        </div>
                    )}

                    {activeCategory === 'home' ? (
                        <>
                            {/* Content Top (Multimedia) */}
                            <div className="content_top">
                                <div className="ct-threadbar">
                                    <h2><span>Media</span></h2>
                                    <ul className="ct-threadbar_list">
                                        {MULTIMEDIA_SECTIONS.map(s => (
                                            <li className="item" key={s.id}><Link
                                                to={`/category/${s.id}`}>{s.title}</Link></li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="ct-list">
                                    <Swiper
                                        modules={[Navigation]}
                                        navigation
                                        slidesPerView={'auto'}
                                        spaceBetween={22}
                                        className="list-ul"
                                    >
                                        {contentTopItems.map((item, idx) => (
                                            <SwiperSlide key={idx} className="li-item" style={{width: '270px'}}>
                                                <Link to="/news/detail" state={{item}} className="item_thumb"
                                                      style={{position: 'relative', display: 'block'}}>
                                                    <img src={getImage(item)} alt={cleanTitle(item.title)}/>
                                                    <div className="icon-play" style={{
                                                        position: 'absolute',
                                                        top: '50%',
                                                        left: '50%',
                                                        transform: 'translate(-50%, -50%)',
                                                        width: '40px',
                                                        height: '40px',
                                                        background: 'rgba(0,0,0,0.6)',
                                                        borderRadius: '50%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        zIndex: 2
                                                    }}>
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                                            <path d="M8 5v14l11-7z"/>
                                                        </svg>
                                                    </div>
                                                    <span className="note">VIDEO</span>
                                                </Link>
                                                <Link to="/news/detail" state={{item}} className="item_title">
                                                    {cleanTitle(item.title)}
                                                </Link>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            </div>

                            <div className="content_center">
                                <div className="cc-left">
                                    {/* TIN NÓNG SECTION */}
                                    <h2 className="tinnong"><span className="txt">TIN NÓNG</span></h2>
                                    <ul className="list-ccl">
                                        {tinNongItems.map((item, index) => (
                                            <li className="ccl-item" key={index}>
                                                <Link to="/news/detail" state={{item}} className="item_thumb">
                                                    <img src={getImage(item)} alt={cleanTitle(item.title)}/>
                                                </Link>
                                                <div className="item_info">
                                                    <Link to={`/category/thoi-su`} className="item_cat">Thời sự</Link>
                                                    <Link to="/news/detail" state={{item}} className="item_title">
                                                        {cleanTitle(item.title)}
                                                    </Link>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Category Blocks */}
                                    {leftColumnSections.map(section => (
                                        <CategoryBlock
                                            key={section.id}
                                            title={section.title}
                                            link={`/category/${section.id}`}
                                            items={section.items}
                                        />
                                    ))}
                                </div>

                                <div className="cc-right">
                                    {/* Dynamic Sections for Right Sidebar */}
                                    {rightColumnSections.map(section => (
                                        <CategoryBlock
                                            key={section.id}
                                            title={section.title}
                                            link={`/category/${section.id}`}
                                            items={section.items}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* DOANH NGHIỆP - SẢN PHẨM - DỊCH VỤ (Full Width Section) */}
                            {doanhNghiepSection && (
                                <div className="doanh-nghiep-section" style={{marginTop: '30px', clear: 'both'}}>
                                    <div className="dn-header" style={{position: 'relative'}}>
                                        <h2 style={{
                                            background: '#d21d21',
                                            color: '#fff',
                                            display: 'inline-block',
                                            padding: '6px 15px',
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                            textTransform: 'uppercase',
                                            marginTop: '0',
                                            position: 'relative',
                                            top: '0'
                                        }}>
                                            DOANH NGHIỆP - SẢN PHẨM - DỊCH VỤ
                                        </h2>
                                    </div>
                                    <div className="box-dn-grid" style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(4, 1fr)',
                                        gap: '20px',
                                        marginTop: '20px'
                                    }}>
                                        {doanhNghiepSection.items.slice(0, 4).map((item, idx) => (
                                            <div key={idx}>
                                                <Link to="/news/detail" state={{item}}
                                                      style={{display: 'block', overflow: 'hidden', height: '160px'}}>
                                                    <img src={getImage(item)} alt={cleanTitle(item.title)}
                                                         style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
                                                </Link>
                                                <Link to="/news/detail" state={{item}} style={{
                                                    display: 'block',
                                                    marginTop: '10px',
                                                    fontSize: '14px',
                                                    fontWeight: 'bold',
                                                    lineHeight: '1.4',
                                                    color: '#333'
                                                }}>
                                                    {cleanTitle(item.title)}
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : activeCategory === 'video' ? (
                        // --- VIDEO CATEGORY VIEW ---
                        <div style={{marginTop: '20px'}}>
                            <CategoryLayout
                                title={CATEGORIES.find(c => c.id === activeCategory)?.name || ''}
                                items={categoryFeedItems}
                            />
                        </div>
                    ) : (
                        // --- STANDARD CATEGORY VIEW ---
                        <div className="content_center">
                            <div className="main-layout"
                                 style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px'}}>
                                <div className="content-col">
                                    <NewsList items={categoryFeedItems}/>
                                </div>
                                <div className="sidebar-col">
                                    {/* Sidebar for standard categories */}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}

export default NewsFeed;
