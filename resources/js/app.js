import Main from '%{ cb "./main.js" }%';
import ProgressDialog from '%{ cb "./progress_dialog.js" }%';

ReactDOM.render(<ProgressDialog />, document.getElementById("progress"));
ReactDOM.render(<Main />, document.getElementById("app"));
