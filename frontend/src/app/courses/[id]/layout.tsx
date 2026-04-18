import { Metadata } from 'next';
import { API_BASE_URL } from '@utils/constants';

interface Props {
  params: { id: string };
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const res = await fetch(`${API_BASE_URL}courses/${params.id}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return {
        title: 'Kurs | Aidevix',
        description: "O'zbek tilidagi professional dasturlash kurslari.",
      };
    }

    const data = await res.json();
    const course = data.data?.course;

    if (!course) {
      return { title: 'Kurs topilmadi | Aidevix' };
    }

    const title = `${course.title} | Aidevix`;
    const description =
      course.description?.slice(0, 160) ||
      `${course.title} — O'zbek tilidagi professional dasturlash kursi.`;
    const image = course.thumbnail || 'https://aidevix.uz/og-image.jpg';
    const url = `https://aidevix.uz/courses/${params.id}`;

    return {
      title,
      description,
      alternates: { canonical: url },
      openGraph: {
        type: 'article',
        url,
        title,
        description,
        siteName: 'Aidevix',
        locale: 'uz_UZ',
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: course.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
      },
      other: {
        'og:type': 'article',
        ...(course.category && { 'article:section': course.category }),
        ...(course.instructor?.username && { 'article:author': course.instructor.username }),
      },
    };
  } catch {
    return {
      title: 'Kurs | Aidevix',
      description: "O'zbek tilidagi professional dasturlash kurslari.",
    };
  }
}

export default function CourseLayout({ children }: Props) {
  return <>{children}</>;
}
