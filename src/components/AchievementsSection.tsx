import React from 'react'
import img1 from '../assets/img1.png'
import img2 from '../assets/img2.png'
import img3 from '../assets/img3.png'
export default function AchievementsSection() {
  return (
    <div className='mt-[45px] mb-10 flex items-center justify-center space-x-3'>
      <img src={img1} alt="Nguyên bản" width={200} />
      <img src={img2} alt="Câu hỏi mỗi ngày" width={300} />
      <img src={img3} alt="Ứng dụng GenAi" width={200} />
    </div>
  )
}
