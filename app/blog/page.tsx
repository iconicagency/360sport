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
  },
  { 
    id: 35, 
    title: "Mất Cân Bằng Điện Giải: Nguyên Nhân, Triệu Chứng Và Cách Phòng Ngừa", 
    excerpt: "Mất cân bằng điện giải là gì? Hiện tượng này rất thường gặp khi chúng ta hoạt động thể thao. Vậy nó có nguy hiểm không? Cùng tìm hiểu nguyên nhân và cách phòng ngừa hiệu quả.", 
    image: "https://picsum.photos/seed/electrolyte-imbalance/800/500", 
    date: "20/10/2024",
    category: "Kiến thức"
  },
  { 
    id: 36, 
    title: "Trẻ Uống Nhiều Nước Điện Giải Có Tốt Không? Những Điều Cha Mẹ Cần Biết", 
    excerpt: "Trẻ nhỏ rất hiếu động và thường xuyên tham gia các hoạt động thể chất. Trẻ uống nhiều nước điện giải có tốt không? Cùng tìm hiểu những lưu ý quan trọng khi cho trẻ dùng nước điện giải.", 
    image: "https://picsum.photos/seed/kids-electrolyte/800/500", 
    date: "18/10/2024",
    category: "Sức khỏe"
  },
  { 
    id: 37, 
    title: "Uống Nước Điện Giải Có Hạ Sốt Không? Khám Phá Sự Thật Đằng Sau", 
    excerpt: "Sốt là phản ứng tự nhiên của cơ thể khi chống lại nhiễm trùng. Liệu uống nước điện giải có hỗ trợ giảm sốt và phục hồi cơ thể? Khám phá sự thật đằng sau phương pháp này.", 
    image: "https://picsum.photos/seed/fever-relief/800/500", 
    date: "15/10/2024",
    category: "Sức khỏe"
  },
  { 
    id: 38, 
    title: "Vì Sao Chị Em Yêu Thích Pickleball Và Luôn Mang Theo 360 Sport?", 
    excerpt: "Pickleball – Môn Thể Thao Đang Gây Sốt Trong Giới Chị Em nhờ tính vui nhộn, dễ chơi và giúp cải thiện sức khỏe. Tại sao 360 Sport lại là lựa chọn hàng đầu của phái đẹp?", 
    image: "https://picsum.photos/seed/pickleball-women/800/500", 
    date: "12/10/2024",
    category: "Tin tức"
  },
  { 
    id: 39, 
    title: "Uống Nước Điện Giải Có Tác Dụng Gì? Tất Cả Những Điều Bạn Cần Biết", 
    excerpt: "Uống nước điện giải có tác dụng gì? Nước điện giải là 1 trong những thức uống rất phổ biến với người hay tập thể thao. Hãy cùng tìm hiểu những lợi ích tuyệt vời của nó đối với sức khỏe và hiệu suất tập luyện.", 
    image: "https://picsum.photos/seed/electrolyte-benefits/800/500", 
    date: "05/10/2024",
    category: "Kiến thức"
  },
  { 
    id: 40, 
    title: "Cách Làm Nước Bù Điện Giải Tại Nhà Hiệu Quả: Bí Quyết Giữ Sức Khỏe Sau Mỗi Hoạt Động", 
    excerpt: "Tìm hiểu cách làm nước bù điện giải ngay tại nhà từ những nguyên liệu đơn giản dễ tìm xung quanh để phục vụ cho việc tập luyện hiệu quả và tiết kiệm. Bí quyết giữ sức khỏe sau mỗi hoạt động.", 
    image: "https://picsum.photos/seed/homemade-electrolyte/800/500", 
    date: "01/10/2024",
    category: "Kiến thức"
  },
  { 
    id: 41, 
    title: "Mách bạn các mẹo hạn chế chấn thương khi chơi thể thao", 
    excerpt: "Nếu bạn không nắm rõ cách kỹ thuật thì có thể gặp phải những chấn thương không đáng có khi chơi thể thao. Cùng tìm hiểu các mẹo hạn chế chấn thương hiệu quả để bảo vệ cơ thể tốt nhất.", 
    image: "https://picsum.photos/seed/sports-injury-prevention/800/500", 
    date: "28/09/2024",
    category: "Kiến thức"
  },
  { 
    id: 42, 
    title: "5 cách làm cho cơ thể luôn trong trạng thái năng lượng cao", 
    excerpt: "Hãy thử thực hiện 5 cách làm cho cơ thể luôn trong trạng thái năng lượng cao để sẵn sàng tham gia mọi hoạt động trong cuộc sống một cách tích cực nhất. Bí quyết duy trì sự tỉnh táo suốt cả ngày.", 
    image: "https://picsum.photos/seed/high-energy/800/500", 
    date: "20/09/2024",
    category: "Kiến thức"
  },
  { 
    id: 43, 
    title: "Sau khi bơi nên làm gì để đảm bảo sức khỏe và an toàn", 
    excerpt: "Nhiều người vẫn chưa biết rõ sau khi bơi nên làm gì để đảm bảo cơ thể phục hồi tốt nhất và đảm bảo sức khoẻ. Hãy tìm hiểu những bước quan trọng sau khi bơi để bảo vệ làn da và hệ hô hấp.", 
    image: "https://picsum.photos/seed/after-swimming/800/500", 
    date: "15/09/2024",
    category: "Sức khỏe"
  },
  { 
    id: 44, 
    title: "8 lợi ích của bơi lội đối với sức khỏe", 
    excerpt: "Lợi ích của bơi lội được thể hiện rất rõ ràng trong việc cải thiện sức khoẻ về mặt thể chất lẫn tinh thần. Khám phá 8 lý do bạn nên bắt đầu bơi lội ngay hôm nay để có một cơ thể dẻo dai.", 
    image: "https://picsum.photos/seed/swimming-benefits/800/500", 
    date: "10/09/2024",
    category: "Sức khỏe"
  },
  { 
    id: 45, 
    title: "8 lợi ích của việc chơi thể thao mà bạn nên biết", 
    excerpt: "Bạn đã biết rõ các lợi ích của việc chơi thể thao cụ thể là như nào chưa? Hãy cùng tìm hiểu những lợi ích và lưu ý quan trọng khi chơi thể thao để đạt hiệu quả cao nhất cho sức khỏe toàn diện.", 
    image: "https://picsum.photos/seed/sports-benefits/800/500", 
    date: "05/09/2024",
    category: "Kiến thức"
  },
  { 
    id: 46, 
    title: "Uống nước gì sau khi tập thể dục?", 
    excerpt: "Nên uống nước gì sau khi tập thể dục để có thể cân bằng lại lượng nước, lượng khoáng trong cơ thể? Tìm hiểu ngay 6 loại nước tốt nhất giúp bạn phục hồi thể lực nhanh chóng.", 
    image: "https://picsum.photos/seed/post-workout-drink/800/500", 
    date: "01/09/2024",
    category: "Dinh dưỡng"
  },
  { 
    id: 47, 
    title: "Chơi cầu lông nên uống nước gì?", 
    excerpt: "Chơi cầu lông nên uống nước gì? Bổ sung nước đúng, đầy đủ và đúng cách là 1 trong những điều bạn nên biết khi chơi môn thể thao đòi hỏi sự linh hoạt và sức bền này.", 
    image: "https://picsum.photos/seed/badminton-hydration/800/500", 
    date: "28/08/2024",
    category: "Dinh dưỡng"
  },
  { 
    id: 48, 
    title: "3 tác dụng của nước điện giải cho người chạy bộ mà bạn nên biết", 
    excerpt: "Chạy bộ là môn thể thao rất phổ biến và khiến cơ thể tiêu tốn nhiều năng lượng và nước. Các loại nước điện giải cho người chạy bộ là lựa chọn tốt giúp tăng sức bền và ngăn ngừa chuột rút hiệu quả.", 
    image: "https://picsum.photos/seed/running-electrolytes/800/500", 
    date: "20/08/2024",
    category: "Kiến thức"
  },
  { 
    id: 49, 
    title: "5 loại nước uống cho người chạy bộ bạn nên thử", 
    excerpt: "Nước uống cho người chạy bộ là một trong những vấn đề được rất nhiều người tập luyện môn thể thao này quan tâm. Cùng tìm hiểu 5 loại nước giúp bạn duy trì thể lực tốt nhất trên mọi cung đường.", 
    image: "https://picsum.photos/seed/running-drinks/800/500", 
    date: "15/08/2024",
    category: "Dinh dưỡng"
  },
  { 
    id: 50, 
    title: "Hướng dẫn chạy bộ đúng cách để giảm cân cho người mới", 
    excerpt: "Có nhiều người quan tâm về vấn đề chạy bộ đúng cách để giảm cân. Cùng 360 SPORT tìm hiểu 7 bước quan trọng giúp bạn đạt được mục tiêu cân nặng mong muốn một cách an toàn và khoa học.", 
    image: "https://picsum.photos/seed/running-weight-loss/800/500", 
    date: "10/08/2024",
    category: "Kiến thức"
  },
  { 
    id: 51, 
    title: "Học cách thở đúng khi chạy bộ", 
    excerpt: "Chạy bộ là hoạt động thể thao rất phổ biến hiện nay. Vì thế cách thở đúng khi chạy bộ là điều bạn cần biết để duy trì sức bền và tránh hụt hơi trong quá trình tập luyện hiệu quả.", 
    image: "https://picsum.photos/seed/running-breathing/800/500", 
    date: "05/08/2024",
    category: "Kiến thức"
  },
  { 
    id: 52, 
    title: "Kỹ thuật chạy bộ đúng cách mà bạn cần biết", 
    excerpt: "Việc chạy bộ đem lại rất nhiều lợi ích cho người tập luyện nhưng bạn cần phải áp dụng các kỹ thuật chạy bộ đúng cách để nâng cao hiệu quả và tránh chấn thương không đáng có.", 
    image: "https://picsum.photos/seed/running-technique/800/500", 
    date: "01/08/2024",
    category: "Kiến thức"
  },
  { 
    id: 53, 
    title: "4 dấu hiệu chạy bộ quá sức bạn cần biết và Cách phục hồi hiệu quả!", 
    excerpt: "Chạy bộ tốt cho sức khoẻ nhưng bạn nên hết sức để ý tới những dấu hiệu chạy bộ quá sức để có biện pháp hồi phục thích hợp, đảm bảo cơ thể luôn trong trạng thái tốt nhất để tiếp tục tập luyện.", 
    image: "https://picsum.photos/seed/overtraining-signs/800/500", 
    date: "28/07/2024",
    category: "Sức khỏe"
  },
  { 
    id: 54, 
    title: "Thương hiệu BS ĐTQG Việt Nam nói gì về Thức uống thể thao 360 SPORT", 
    excerpt: "Câu chuyện về một thức uống thể thao thuần Việt, được tin dùng bởi chính những người làm nên lịch sử thể thao nước nhà. Khám phá lý do tại sao 360 SPORT lại được các chuyên gia và vận động viên hàng đầu tin tưởng.", 
    image: "https://picsum.photos/seed/national-team-doctor/800/500", 
    date: "20/07/2024",
    category: "Tin tức"
  },
  { 
    id: 55, 
    title: "Chơi thể thao đẩy lùi bệnh tật", 
    excerpt: "Sức khỏe là một “kho báu”. Việc chăm sóc sức khỏe cần phải được thực hiện từ thời thơ ấu và duy trì đến hết cuộc đời. Chơi thể thao là cách tốt nhất để bảo vệ kho báu đó và đẩy lùi mọi bệnh tật.", 
    image: "https://picsum.photos/seed/sports-health/800/500", 
    date: "15/07/2024",
    category: "Sức khỏe"
  },
  { 
    id: 56, 
    title: "Mẹo hạn chế chấn thương khi chơi thể thao", 
    excerpt: "Chấn thương trong thể thao là điều có thể xảy ra với bất kỳ ai. Tìm hiểu 14 mẹo quan trọng giúp bạn phòng tránh chấn thương hiệu quả và duy trì phong độ tập luyện ổn định trong thời gian dài.", 
    image: "https://picsum.photos/seed/injury-prevention-tips/800/500", 
    date: "10/07/2024",
    category: "Kiến thức"
  },
  { 
    id: 57, 
    title: "Chuẩn bị gì trước khi chạy bộ", 
    excerpt: "Chạy bộ buổi sáng là một trong những cách tập thể dục tốt nhất giúp bạn rèn luyện sức khỏe. Việc chuẩn bị kỹ lưỡng về trang phục và dinh dưỡng trước khi chạy là vô cùng quan trọng để đạt hiệu quả cao.", 
    image: "https://picsum.photos/seed/running-preparation/800/500", 
    date: "05/07/2024",
    category: "Kiến thức"
  },
  { 
    id: 58, 
    title: "Chạy bộ có tác dụng gì cho nữ giới? Có giúp dáng đẹp eo thon?", 
    excerpt: "Chạy bộ không chỉ mang lại những lợi ích chung về sức khoẻ cho phái đẹp mà còn giúp cải thiện vóc dáng, làm săn chắc cơ bụng và giảm thiểu các triệu chứng khó chịu định kỳ hiệu quả.", 
    image: "https://picsum.photos/seed/women-running-benefits/800/500", 
    date: "01/07/2024",
    category: "Sức khỏe"
  },
  { 
    id: 59, 
    title: "Các môn thể thao rèn luyện sức mạnh", 
    excerpt: "Trong thể thao, làm thế nào để tăng cường thể lực là một điều vô cùng quan trọng. Khám phá các môn thể thao sức mạnh giúp bạn tăng cường thể lực hiệu quả nhất như Gym, Chạy bộ, Bơi lội và Leo núi.", 
    image: "https://picsum.photos/seed/strength-sports/800/500", 
    date: "20/06/2024",
    category: "Kiến thức"
  },
  { 
    id: 60, 
    title: "Các môn thể thao sức bền", 
    excerpt: "Thể lực là nền tảng sức khỏe của con người. Tìm hiểu những quy tắc cần biết khi muốn rèn thể lực và 7 môn thể thao hỗ trợ tăng sức bền hiệu quả như Đạp xe, Yoga, HIIT và Khiêu vũ.", 
    image: "https://picsum.photos/seed/endurance-sports/800/500", 
    date: "15/06/2024",
    category: "Kiến thức"
  },
  { 
    id: 61, 
    title: "Khoáng chất là gì? Vai trò của khoáng chất với cơ thể", 
    excerpt: "Khoáng chất là những “viên gạch” thầm lặng xây dựng nên sức mạnh và sự dẻo dai của cơ thể. Khám phá vai trò quan trọng của khoáng chất đối với hiệu suất thể thao và sức khỏe tổng thể của bạn.", 
    image: "https://picsum.photos/seed/minerals-role/800/500", 
    date: "10/06/2024",
    category: "Kiến thức"
  },
  { 
    id: 62, 
    title: "Chạy bộ có tác dụng gì cho nam giới? Hỗ trợ hiệu quả việc tập luyện với thức uống thể thao 360 SPORT", 
    excerpt: "Chạy bộ mang lại vô vàn lợi ích cho sức khỏe nam giới như tăng cường tim mạch, cải thiện sinh lý và duy trì vóc dáng. Tìm hiểu cách 360 SPORT hỗ trợ hiệu quả quá trình tập luyện của phái mạnh.", 
    image: "https://picsum.photos/seed/men-running-benefits/800/500", 
    date: "05/06/2024",
    category: "Sức khỏe"
  },
  { 
    id: 63, 
    title: "Tăng hiệu suất khi chơi thể thao", 
    excerpt: "Hiệu suất tập luyện không chỉ phụ thuộc vào thể lực. Khám phá 5 bí quyết tối ưu hóa hiệu suất thể thao của bạn thông qua dinh dưỡng, âm nhạc và kế hoạch tập luyện rõ ràng để đạt kết quả tốt nhất.", 
    image: "https://picsum.photos/seed/sports-performance/800/500", 
    date: "01/06/2024",
    category: "Kiến thức"
  },
  { 
    id: 64, 
    title: "Bù khoáng là gì?", 
    excerpt: "Nước bù khoáng chứa các khoáng chất thiết yếu đối với cơ thể. Tìm hiểu vai trò của nước bù khoáng trong việc tăng cường đề kháng, cải thiện tiêu hóa và hỗ trợ giảm cân hiệu quả cho người tập thể thao.", 
    image: "https://picsum.photos/seed/remineralization/800/500", 
    date: "28/05/2024",
    category: "Kiến thức"
  },
  { 
    id: 65, 
    title: "Tập luyện thể thao tăng sức đề kháng", 
    excerpt: "Thể dục thể thao là “Chìa khóa vàng” cho sức khỏe. Tìm hiểu ý nghĩa của việc tập luyện và các mẹo giúp bạn duy trì thói quen rèn luyện đều đặn mỗi ngày để nâng cao sức đề kháng và phòng ngừa bệnh tật.", 
    image: "https://picsum.photos/seed/sports-resistance/800/500", 
    date: "20/05/2024",
    category: "Sức khỏe"
  },
  { 
    id: 66, 
    title: "Chạy bộ có tác dụng gì? Bí quyết cho sức khỏe toàn diện và tinh thần sảng khoái!", 
    excerpt: "Chạy bộ có tác dụng gì mà lại được ưa chuộng như hiện nay? Khám phá những lợi ích tuyệt vời về tim mạch, vóc dáng và tinh thần mà bộ môn này mang lại cho bạn mỗi ngày.", 
    image: "https://picsum.photos/seed/running-benefits-all/800/500", 
    date: "15/05/2024",
    category: "Sức khỏe"
  },
  { 
    id: 67, 
    title: "Lợi ích của việc chạy bộ", 
    excerpt: "Chạy bộ không chỉ là một môn thể thao, mà còn là liều thuốc tự nhiên kỳ diệu cho sức khỏe và tinh thần. Khám phá 12 lợi ích tuyệt vời của chạy bộ đối với tim mạch, xương khớp và tuổi thọ của bạn.", 
    image: "https://picsum.photos/seed/running-benefits-12/800/500", 
    date: "05/05/2024",
    category: "Kiến thức"
  },
  { 
    id: 68, 
    title: "Các Môn Thể Thao Dễ Tập – Nhẹ Nhàng", 
    excerpt: "Bạn muốn duy trì sức khỏe nhưng không muốn tập luyện quá sức? Khám phá những môn thể thao dễ tập, nhẹ nhàng mà vẫn mang lại hiệu quả bất ngờ cho vóc dáng và tinh thần sảng khoái mỗi ngày.", 
    image: "https://picsum.photos/seed/easy-sports/800/500", 
    date: "01/05/2024",
    category: "Kiến thức"
  },
  { 
    id: 69, 
    title: "TÁC DỤNG CỦA ISOTONIC TRONG THỂ THAO", 
    excerpt: "Thức uống Isotonic được pha chế đặc biệt để giúp vận động viên bù nước và năng lượng nhanh chóng. Tìm hiểu vai trò quan trọng của Isotonic trong chế độ dinh dưỡng và tập luyện chuyên nghiệp hàng ngày.", 
    image: "https://picsum.photos/seed/isotonic-benefits/800/500", 
    date: "28/04/2024",
    category: "Dinh dưỡng"
  },
  { 
    id: 70, 
    title: "Uống nhiều nước điện giải có tốt không?", 
    excerpt: "Tìm hiểu việc uống nhiều nước điện giải có tốt không và 7 lợi ích “vàng\" của nước điện giải đối với sức khoẻ. Cùng khám phá những lưu ý quan trọng khi sử dụng nước bù khoáng đúng cách.", 
    image: "https://picsum.photos/seed/drinking-electrolytes/800/500", 
    date: "20/04/2024",
    category: "Kiến thức"
  },
  { 
    id: 71, 
    title: "Phân loại các môn thể thao", 
    excerpt: "Việc phân loại các môn thể thao sẽ giúp bạn dễ dàng tìm thấy bộ môn phù hợp với sở thích và mục tiêu sức khỏe của mình. Khám phá các nhóm thể thao dưới nước, cá nhân và đồng đội phổ biến nhất.", 
    image: "https://picsum.photos/seed/sports-classification/800/500", 
    date: "15/04/2024",
    category: "Kiến thức"
  },
  { 
    id: 72, 
    title: "Lời khuyên dành cho người chơi thể thao", 
    excerpt: "Bảy lời khuyên từ các bác sĩ dinh dưỡng của các vận động viên Olympic sẽ giúp bạn tập luyện sung sức hơn, bền sức hơn. Khám phá bí quyết về bữa sáng, bù khoáng và phục hồi sau tập luyện hiệu quả.", 
    image: "https://picsum.photos/seed/sports-advice/800/500", 
    date: "05/04/2024",
    category: "Kiến thức"
  },
  { 
    id: 73, 
    title: "Các loại nước bù điện giải nào tốt? Bổ sung năng lượng, bù khoáng bù điện giải hiệu quả với 360 SPORT", 
    excerpt: "Các loại nước bù điện giải đóng vai trò quan trọng trong việc duy trì cân bằng dịch thể và điều hòa nhịp tim. Tìm hiểu ưu điểm của 360 SPORT trong việc hỗ trợ phục hồi năng lượng hiệu quả mỗi ngày.", 
    image: "https://picsum.photos/seed/best-electrolytes/800/500", 
    date: "01/04/2024",
    category: "Dinh dưỡng"
  },
  { 
    id: 74, 
    title: "PHÒNG TRÁNH CHUỘT RÚT KHI CHƠI THỂ THAO", 
    excerpt: "Chuột rút là tình trạng co rút cơ đột ngột và gây đau khi đang vận động. Tìm hiểu nguyên nhân và cách phòng tránh chuột rút hiệu quả để bảo vệ cơ thể trong suốt quá trình tập luyện thể thao cường độ cao.", 
    image: "https://picsum.photos/seed/cramp-prevention/800/500", 
    date: "20/03/2024",
    category: "Kiến thức"
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
