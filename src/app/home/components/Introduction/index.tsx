"use client";

import styles from "./styles.module.scss";
import {Typography} from "antd";
import {introLibrary, introList} from "@/app/home/components/Introduction/data";
import LibrarySlider from "@/app/home/components/Introduction/LibrarySlider";
import {Book} from "@/components/icons";

export default function Introduction() {

  return (
    <div id="introduction" className="relative">
      <div className={`${styles.container}`}>
        <div>
          <div className={`${styles.info} mb-8`}>
            <div className={styles.tag}>
              <Book/>
              <Typography.Text>Giới thiệu về thư viện</Typography.Text>
            </div>
            <p className={styles.description}>
              D Free Book là một thư viện cộng đồng cho mượn sách miễn phí và đặt cọc niềm tin. Chúng mình có cơ sở Đại
              La và cơ sở Cầu Giấy, cả hai đều gần các trường đại học lớn. Bạn đọc của thư viện phần lớn là sinh viên,
              ngoài ra có người đi làm và học sinh.
            </p>
            <p className={styles.description}>
             Qua hơn 6 năm hoạt động, D Free Book đã xây
              dựng được một cộng đồng yêu sách và ngày càng mở rộng kết nối với những người bạn cùng chung lý tưởng.
            </p>
          </div>
          <div className="flex flex-col gap-16">
            {introLibrary.map((item, index) => (
              <div key={item.id}>
                <div className={`${styles.info} mb-8`}>
                  <Typography.Title className={styles.title}>{item.title}</Typography.Title>
                  <p className={styles.subTitle}>{item.address}</p>
                </div>
                <LibrarySlider images={item.images}/>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-8">
          {introList.map((item, index) => (
            <div
              style={{flexDirection: ((index + 1) % 2 !== 0) ? "row" : "row-reverse"}}
              key={item.id}
              className={`${styles.introItem} items-center md-flex-col`}>
              <div className={styles.image}>
                <img className={styles.image} src={item.image} alt="img"/>
              </div>
              <div className={styles.info}>
                <div className={styles.tag}>
                  {item.icon}
                  <Typography.Text>{item.tag}</Typography.Text>
                </div>

                <Typography.Title className={styles.title}>{item.title}</Typography.Title>
                <div>
                  {item.description.map((item, index) => (
                    <div key={index} className={styles.description} dangerouslySetInnerHTML={{__html: item}}></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="lg-hidden">
        <img className={styles.spreadOne} src="/images/spread-1.svg" alt=""/>
        <img className={styles.spreadTwo} src="/images/spread-2.svg" alt=""/>
        <img className={styles.spreadThree} src="/images/spread-3.svg" alt=""/>
      </div>
    </div>
  )
}