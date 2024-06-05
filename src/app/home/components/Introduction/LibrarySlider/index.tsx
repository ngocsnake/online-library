import {Gallery} from "react-grid-gallery";
import "./styles.css";

interface LibrarySliderProps {
  images: any[];
}

export default function LibrarySlider(props: LibrarySliderProps) {
  const {images} = props;

  return (
    <div className="library-slider">
      <Gallery enableImageSelection={false} images={images}/>
    </div>
  );
}