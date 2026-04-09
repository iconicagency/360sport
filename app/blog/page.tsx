'use client';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const posts = [
  { 
    id: 1, 
    title: "360Sport đồng hành cùng những nhà vô địch Ultra Trail Yên Tử 2025: Tôn vinh sức mạnh bền bỉ", 
    excerpt: "Ultra Trail Yên Tử 2025 không chỉ là một giải chạy địa hình đầy thử thách mà còn là nơi tôn vinh những ý chí kiên cường...", 
    image: "https://picsum.photos/seed/blog1/800/500", 
    date: "11/09/2025",
    category: "Sự kiện"
  },
  { 
    id: 2, 
    title: "Tinh thần bền bỉ tại Ultra Trail Yên Tử 2025 – Khi 360Sport tiếp sức cho từng bước chạy", 
    excerpt: "Trong không gian linh thiêng và hùng vĩ của non thiêng Yên Tử, giải chạy Ultra Trail Yên Tử 2025 đã diễn ra đầy cảm xúc...", 
    image: "https://picsum.photos/seed/blog2/800/500", 
    date: "11/09/2025",
    category: "Sự kiện"
  },
  { 
    id: 3, 
    title: "360Sport đồng hành cùng Ultra Trail Yên Tử 2025: Tiếp sức hơn 1.000 vận động viên khám phá di sản", 
    excerpt: "Giải chạy địa hình Ultra Trail Yên Tử 2025 đã chính thức khép lại với những dấu ấn khó quên. 360 SPORT tự hào là nhà tài trợ...", 
    image: "https://picsum.photos/seed/blog3/800/500", 
    date: "11/09/2025",
    category: "Sự kiện"
  },
  { 
    id: 4, 
    title: "Ultra Trail Yên Tử 2025: Hơn 1.000 bước chân chinh phục, lan tỏa tinh hoa di sản", 
    excerpt: "Giải chạy Ultra Trail Yên Tử 2025 đã thu hút hàng ngàn vận động viên tham gia chinh phục các cung đường đầy thử thách...", 
    image: "https://picsum.photos/seed/blog4/800/500", 
    date: "08/09/2025",
    category: "Sự kiện"
  },
  { 
    id: 5, 
    title: "Vì Sao Chị Em Yêu Thích Pickleball Và Luôn Mang Theo 360 Sport?", 
    excerpt: "Pickleball đang trở thành môn thể thao xu hướng được nhiều chị em yêu thích. Cùng tìm hiểu lý do và bí quyết giữ năng lượng...", 
    image: "https://picsum.photos/seed/blog5/800/500", 
    date: "21/03/2025",
    category: "Kiến thức"
  },
  { 
    id: 6, 
    title: "Bí Quyết Hoạt Động Thể Thao Hàng Ngày Giúp Bạn Luôn Tràn Đầy Năng Lượng", 
    excerpt: "Duy trì thói quen tập luyện thể thao mỗi ngày không chỉ giúp cơ thể khỏe mạnh mà còn mang lại tinh thần sảng khoái...", 
    image: "https://picsum.photos/seed/blog6/800/500", 
    date: "15/03/2025",
    category: "Kiến thức"
  },
  { 
    id: 7, 
    title: "Top Sản Phẩm Bán Chạy Của 360 Sport – Giải Pháp Bổ Sung Điện Giải Hiệu Quả", 
    excerpt: "Khám phá những sản phẩm được yêu thích nhất từ 360 Sport, giúp bạn bổ sung năng lượng và điện giải nhanh chóng...", 
    image: "https://picsum.photos/seed/blog7/800/500", 
    date: "10/03/2025",
    category: "Sản phẩm"
  },
  { 
    id: 8, 
    title: "Trở Thành Đại Lý 360 Sport – Cùng Lan Tỏa Năng Lượng Cho Giới Thể Thao!", 
    excerpt: "Cơ hội hợp tác kinh doanh cùng 360 Sport, mang đến những sản phẩm chất lượng cho cộng đồng yêu thể thao...", 
    image: "https://picsum.photos/seed/blog8/800/500", 
    date: "05/03/2025",
    category: "Tin tức"
  },
  { 
    id: 9, 
    title: "Viên Sủi 360 Sport – Bứt Phá Giới Hạn, Tăng Cường Thể Lực", 
    excerpt: "Sản phẩm viên sủi tiện lợi từ 360 Sport giúp bạn dễ dàng mang theo và bổ sung năng lượng mọi lúc mọi nơi...", 
    image: "https://picsum.photos/seed/blog9/800/500", 
    date: "01/03/2025",
    category: "Sản phẩm"
  },
  { 
    id: 10, 
    title: "Cách Build Cơ Hiệu Quả Khi Tập Gym Với 360 Sport", 
    excerpt: "Kết hợp tập luyện đúng cách và bổ sung dinh dưỡng hợp lý cùng 360 Sport để đạt hiệu quả xây dựng cơ bắp tối ưu...", 
    image: "https://picsum.photos/seed/blog10/800/500", 
    date: "25/02/2025",
    category: "Kiến thức"
  },
  { 
    id: 11, 
    title: "360 Sport – Giải Pháp Bù Nước, Bù Khoáng Tối Ưu Cho Những Buổi Chạy Dài", 
    excerpt: "Tìm hiểu tại sao 360 Sport lại là sự lựa chọn hàng đầu của các runner trong những buổi chạy đường dài...", 
    image: "https://picsum.photos/seed/blog11/800/500", 
    date: "20/02/2025",
    category: "Kiến thức"
  },
  { 
    id: 12, 
    title: "Quà Tặng Độc Quyền Từ 360 Sport: Sự Kết Hợp Hoàn Hảo Cho Sức Khỏe", 
    excerpt: "Chương trình tri ân khách hàng với những phần quà hấp dẫn và độc quyền từ thương hiệu 360 Sport...", 
    image: "https://picsum.photos/seed/blog12/800/500", 
    date: "15/02/2025",
    category: "Tin tức"
  },
  { 
    id: 13, 
    title: "Chinh Phục Giấc Mơ Thể Thao Cùng 360 Sport", 
    excerpt: "Hành trình theo đuổi đam mê thể thao luôn cần sự bền bỉ. Hãy để 360 Sport đồng hành cùng bạn trên mỗi bước đường...", 
    image: "https://picsum.photos/seed/blog13/800/500", 
    date: "10/02/2025",
    category: "Kiến thức"
  },
  { 
    id: 14, 
    title: "Tầm Quan Trọng Của Việc Cung Cấp Đủ Nước Cho Cơ Thể", 
    excerpt: "Nước đóng vai trò thiết yếu trong mọi hoạt động sống. Tìm hiểu tại sao việc bổ sung đủ nước lại quan trọng đến vậy...", 
    image: "https://picsum.photos/seed/blog14/800/500", 
    date: "05/02/2025",
    category: "Sức khỏe"
  },
  { 
    id: 15, 
    title: "Chất Điện Giải – Yếu Tố Quan Trọng Giúp Cơ Thể Cân Bằng Và Hoạt Động Hiệu Quả", 
    excerpt: "Điện giải không chỉ giúp cân bằng lượng nước mà còn hỗ trợ chức năng cơ bắp và thần kinh. Khám phá chi tiết...", 
    image: "https://picsum.photos/seed/blog15/800/500", 
    date: "01/02/2025",
    category: "Dinh dưỡng"
  },
  { 
    id: 16, 
    title: "Chuột Rút Khi Chơi Thể Thao – Nguyên Nhân Và Cách Khắc Phục", 
    excerpt: "Chuột rút là nỗi ám ảnh của nhiều người chơi thể thao. Cùng tìm hiểu nguyên nhân và các biện pháp phòng ngừa hiệu quả...", 
    image: "https://picsum.photos/seed/blog16/800/500", 
    date: "25/01/2025",
    category: "Kiến thức"
  },
  { 
    id: 17, 
    title: "Khoáng Chất Trong Nước: Tầm Quan Trọng Và Lợi Ích Cho Sức Khỏe", 
    excerpt: "Không chỉ cung cấp nước, các khoáng chất hòa tan còn mang lại nhiều lợi ích bất ngờ cho sức khỏe toàn diện...", 
    image: "https://picsum.photos/seed/blog17/800/500", 
    date: "20/01/2025",
    category: "Sức khỏe"
  },
  { 
    id: 18, 
    title: "Bác sĩ Trần Huy Thọ - Chuyên gia dinh dưỡng Đội tuyển Quốc gia Việt Nam đánh giá cao thức uống thể thao 360 SPORT", 
    excerpt: "Lắng nghe những chia sẻ và đánh giá chuyên môn từ Bác sĩ Trần Huy Thọ về hiệu quả của thức uống 360 SPORT...", 
    image: "https://picsum.photos/seed/blog18/800/500", 
    date: "15/01/2025",
    category: "Tin tức"
  },
  { 
    id: 19, 
    title: "Nên chơi Pickleball vào thời gian nào để đạt hiệu quả tốt nhất?", 
    excerpt: "Lựa chọn thời điểm chơi Pickleball phù hợp không chỉ giúp nâng cao hiệu suất mà còn bảo vệ sức khỏe của bạn...", 
    image: "https://picsum.photos/seed/blog19/800/500", 
    date: "10/01/2025",
    category: "Kiến thức"
  },
  { 
    id: 20, 
    title: "Trước khi chơi Pickleball nên làm gì? Chuẩn bị kỹ để có buổi tập hiệu quả", 
    excerpt: "Khởi động đúng cách và chuẩn bị đầy đủ trang bị là chìa khóa cho một buổi tập Pickleball an toàn và hiệu quả...", 
    image: "https://picsum.photos/seed/blog20/800/500", 
    date: "05/01/2025",
    category: "Kiến thức"
  },
  { 
    id: 21, 
    title: "Chơi Pickleball nên uống gì? Bí quyết giữ sức bền và phục hồi nhanh chóng", 
    excerpt: "Khám phá các loại thức uống phù hợp giúp bạn duy trì thể lực và phục hồi nhanh chóng sau những trận Pickleball căng thẳng...", 
    image: "https://picsum.photos/seed/blog21/800/500", 
    date: "01/01/2025",
    category: "Dinh dưỡng"
  },
  { 
    id: 22, 
    title: "Có thể bạn đã biết – nhưng không làm: Lợi ích của uống đủ nước “lợi hại” như thế nào?", 
    excerpt: "Uống đủ nước mang lại những lợi ích tuyệt vời cho cơ thể mà đôi khi chúng ta thường bỏ qua. Cùng tìm hiểu chi tiết...", 
    image: "https://picsum.photos/seed/blog22/800/500", 
    date: "25/12/2024",
    category: "Sức khỏe"
  },
  { 
    id: 23, 
    title: "[Khuyến cáo] Uống nước sau khi tập thể dục? Tuyệt đối không uống nước đá lạnh!! Vậy nên uống gì?", 
    excerpt: "Nhiều người có thói quen uống nước đá lạnh sau khi tập luyện mà không biết những tác hại tiềm ẩn. Đâu là giải pháp đúng đắn?", 
    image: "https://picsum.photos/seed/blog23/800/500", 
    date: "20/12/2024",
    category: "Kiến thức"
  },
  { 
    id: 24, 
    title: "Người hoạt động nhiều có nhất thiết phải uống nước điện giải cho người tập thể thao không?", 
    excerpt: "Giải đáp thắc mắc về việc liệu nước lọc thông thường có đủ cho những người thường xuyên vận động mạnh hay không...", 
    image: "https://picsum.photos/seed/blog24/800/500", 
    date: "15/12/2024",
    category: "Dinh dưỡng"
  },
  { 
    id: 25, 
    title: "Nước uống cho người chơi thể thao – Sản phẩm thiết yếu cho những người yêu thích vận động", 
    excerpt: "Khám phá tầm quan trọng của các loại nước uống chuyên dụng dành riêng cho người chơi thể thao và vận động viên...", 
    image: "https://picsum.photos/seed/blog25/800/500", 
    date: "10/12/2024",
    category: "Sản phẩm"
  },
  { 
    id: 26, 
    title: "Bạn đã bù nước khi chơi thể thao đúng cách chưa?", 
    excerpt: "Bù nước không chỉ đơn giản là uống khi khát. Tìm hiểu phương pháp bù nước khoa học để tối ưu hóa hiệu suất tập luyện...", 
    image: "https://picsum.photos/seed/blog26/800/500", 
    date: "05/12/2024",
    category: "Kiến thức"
  },
  { 
    id: 27, 
    title: "Nước bù điện giải là gì? Sai lầm khi bổ sung nước bù điện giải sai cách!", 
    excerpt: "Hiểu rõ về nước bù điện giải và những sai lầm phổ biến mà nhiều người mắc phải khi sử dụng loại thức uống này...", 
    image: "https://picsum.photos/seed/blog27/800/500", 
    date: "01/12/2024",
    category: "Kiến thức"
  },
  { 
    id: 28, 
    title: "Nước bù khoáng là gì? Tại sao nhân viên văn phòng cũng cần uống nước bù khoáng? Cùng khám phá 360 Sport", 
    excerpt: "Không chỉ người chơi thể thao, nhân viên văn phòng cũng cần bổ sung khoáng chất để duy trì sự tỉnh táo và hiệu suất làm việc...", 
    image: "https://picsum.photos/seed/blog28/800/500", 
    date: "25/11/2024",
    category: "Kiến thức"
  },
  { 
    id: 29, 
    title: "Tập Gym Nên Uống Nước Gì Để Đạt Hiệu Quả Tốt Nhất?", 
    excerpt: "Lựa chọn thức uống phù hợp trước, trong và sau khi tập gym giúp tối ưu hóa quá trình xây dựng cơ bắp và phục hồi...", 
    image: "https://picsum.photos/seed/blog29/800/500", 
    date: "20/11/2024",
    category: "Dinh dưỡng"
  },
  { 
    id: 30, 
    title: "Đá Bóng Nên Uống Nước Gì Để Đạt Hiệu Quả Tốt Nhất?", 
    excerpt: "Bóng đá là môn thể thao đòi hỏi thể lực cao. Tìm hiểu các loại nước uống giúp cầu thủ duy trì sức bền trên sân cỏ...", 
    image: "https://picsum.photos/seed/blog30/800/500", 
    date: "15/11/2024",
    category: "Dinh dưỡng"
  },
  { 
    id: 31, 
    title: "Tập Thể Dục Xong Nên Uống Nước Gì Để Đạt Hiệu Quả Tốt Nhất?", 
    excerpt: "Khám phá những loại thức uống tốt nhất giúp cơ thể phục hồi nhanh chóng sau mỗi buổi tập thể dục mệt mỏi...", 
    image: "https://picsum.photos/seed/blog31/800/500", 
    date: "10/11/2024",
    category: "Dinh dưỡng"
  },
  { 
    id: 32, 
    title: "Cách Bổ Sung Điện Giải Hiệu Quả: Bí Quyết Duy Trì Sức Khỏe Sau Mỗi Hoạt Động", 
    excerpt: "Hướng dẫn chi tiết cách bổ sung điện giải đúng cách để duy trì năng lượng và sức khỏe dẻo dai...", 
    image: "https://picsum.photos/seed/blog32/800/500", 
    date: "05/11/2024",
    category: "Kiến thức"
  },
  { 
    id: 33, 
    title: "Rối Loạn Điện Giải Nên Ăn Gì? Thực Phẩm Tốt Cho Việc Phục Hồi Cân Bằng Điện Giải", 
    excerpt: "Danh sách các loại thực phẩm tự nhiên giúp phục hồi cân bằng điện giải nhanh chóng và an toàn cho cơ thể...", 
    image: "https://picsum.photos/seed/blog33/800/500", 
    date: "01/11/2024",
    category: "Dinh dưỡng"
  },
  { 
    id: 34, 
    title: "Vì Sao Chị Em Yêu Thích Pickleball Và Luôn Mang Theo 360 Sport?", 
    excerpt: "Giải mã sức hút của môn thể thao Pickleball đối với phái đẹp và lý do 360 Sport luôn là người bạn đồng hành tin cậy...", 
    image: "https://picsum.photos/seed/blog34/800/500", 
    date: "25/10/2024",
    category: "Tin tức"
  }
];

export default function BlogPage() {
  const [dbPosts, setDbPosts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const querySnapshot = await getDocs(collection(db, 'blogPosts'));
        const fetchedPosts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDbPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      }
    }
    fetchPosts();
  }, []);

  const allPosts = [...dbPosts, ...posts];

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-gray-900">Nhịp sống 360 SPORT</h1>
          <div className="w-24 h-1 bg-[#f97316] mt-4 mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Cập nhật những tin tức sự kiện mới nhất, kiến thức thể thao và hành trình đồng hành cùng cộng đồng của 360 SPORT.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
              <Link href="#" className="relative h-56 overflow-hidden group">
                <div className="absolute top-4 left-4 z-10 bg-[#f97316] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {post.category}
                </div>
                <Image 
                  src={post.image} 
                  alt={post.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </Link>
              <div className="p-6 flex flex-col flex-grow">
                <div className="text-sm text-gray-500 mb-3 font-medium">{post.date}</div>
                <h2 className="text-xl font-bold mb-3 line-clamp-2 hover:text-[#f97316] transition-colors leading-snug">
                  <Link href="#">{post.title}</Link>
                </h2>
                <p className="text-gray-600 line-clamp-3 mb-4 flex-grow">{post.excerpt}</p>
                <Link href="#" className="text-[#f97316] font-bold text-sm uppercase tracking-wider hover:underline flex items-center gap-1 mt-auto">
                  Đọc tiếp &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
