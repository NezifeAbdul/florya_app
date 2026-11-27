
import AOS from "aos";
import { useEffect } from "react";

interface   sectionTitleProps{
  subtitle:string;
  title:string;
  img:string;
  className?:string
}


const SectionTitle = ({ subtitle, title,img, className}:sectionTitleProps) => {
    useEffect(() => {
      AOS.init({ duration: 1000, once: true });
    }, []);
  return (
    <div className={`section-title text-center mb-5 ${className??""} data-aos="fade-up"`}>
      <p>{subtitle}</p>
      <h2>{title}</h2>
      <img src={img} alt="decorative-leaf" className="services-leaf"/>
    </div>
  )
}

export default SectionTitle