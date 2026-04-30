'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import CourseCard from '@components/courses/CourseCard';

type Course = {
  _id: string;
  [key: string]: unknown;
};

interface Props {
  courses: Course[];
}

export default function RecommendedCarousel({ courses }: Props) {
  return (
    <Swiper
      modules={[Navigation]}
      slidesPerView={2}
      spaceBetween={12}
      navigation
      breakpoints={{
        768: { slidesPerView: 2, spaceBetween: 16 },
        1024: { slidesPerView: 3, spaceBetween: 20 },
      }}
      className="!pb-1"
    >
      {courses.map((c, i) => (
        <SwiperSlide key={c._id}>
          <CourseCard course={c} index={i} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
