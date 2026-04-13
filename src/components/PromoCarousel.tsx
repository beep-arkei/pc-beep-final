import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Promotion } from '../types';
import { Loader2 } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export const PromoCarousel: React.FC = () => {
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const { data, error } = await supabase
          .from('promotions')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (error) throw error;
        setPromos(data || []);
      } catch (error) {
        console.error('Error fetching promos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromos();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-[300px] md:h-[500px] bg-slate-900 flex items-center justify-center">
        <Loader2 className="animate-spin text-cyan" size={48} />
      </div>
    );
  }

  if (promos.length === 0) return null;

  return (
    <div className="w-full relative group">
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="w-full h-[300px] md:h-[500px]"
      >
        {promos.map((promo) => (
          <SwiperSlide key={promo.id}>
            {promo.redirect_link ? (
              <Link to={promo.redirect_link} className="block w-full h-full">
                <img 
                  src={promo.image_url} 
                  alt="Promotion" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </Link>
            ) : (
              <div className="w-full h-full">
                <img 
                  src={promo.image_url} 
                  alt="Promotion" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      <style>{`
        .swiper-button-next, .swiper-button-prev {
          color: #00e5ff !important;
          background: rgba(15, 23, 42, 0.5);
          width: 50px;
          height: 50px;
          border-radius: 4px;
          opacity: 0;
          transition: all 0.3s ease;
        }
        .swiper-button-next:after, .swiper-button-prev:after {
          font-size: 20px !important;
          font-weight: bold;
        }
        .group:hover .swiper-button-next, .group:hover .swiper-button-prev {
          opacity: 1;
        }
        .swiper-pagination-bullet {
          background: #fff !important;
          opacity: 0.5;
        }
        .swiper-pagination-bullet-active {
          background: #00e5ff !important;
          opacity: 1;
          width: 20px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};
