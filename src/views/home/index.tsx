import "./style.scss"
import {memo} from 'react'
import {withRouter} from "@/hoc"

const Index = memo((props: { router: any }) => {


  return (
    <div className="zf-home-page">
      首页
    </div>
  );
});

export default withRouter(Index);
