import "./style.scss"
import {memo} from 'react'
import {withRouter} from "@/hoc"

const Index = memo((props: { router: any }) => {


  return (
    <div className="zf-auth-signup-page">
      注册
    </div>
  );
});

export default withRouter(Index);
