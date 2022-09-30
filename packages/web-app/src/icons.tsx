import React from "react";
import { SvgIcon } from "@material-ui/core";

export {
  AccessTime as CreatedAtIcon,
  Add as CreateMessageIcon,
  Add as CreateOrderIcon,
  ArrowBack as GoBackIcon,
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  AvTimer as PhaseDeadlineIcon,
  Block as WhitelistIcon,
  BugReport as BugReportIcon,
  Cached as RandomGameNameIcon,
  ChatBubble as ChatLanguageIcon,
  Check as ConfirmedReadyIcon,
  CheckBox as CheckBoxIconChecked,
  CheckBoxOutlineBlank as CheckBoxIconUnchecked,
  ChevronLeft as PreviousIcon,
  ChevronRight as NextIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Delete as KickIcon,
  Edit as EditIcon,
  EventNote as EventIcon,
  ExpandMore as ExpandIcon,
  FastForward as FastForwardIcon,
  Gavel as GavelIcon,
  GetApp as DownloadIcon,
  GitHub as GitHubIcon,
  HourglassEmpty as EndsAfterThisYearIcon,
  Lock as PrivateGameIcon,
  Map as GameVariantIcon,
  Map as MapIcon,
  Menu as MenuIcon,
  Message as ChatIcon,
  MicOff as MuteIcon,
  MonetizationOn as DonateIcon,
  MoreVert as MoreIcon,
  PanTool as MusteringIcon,
  People as NumMembersIcon,
  PlaylistAddCheck as NationAllocationIcon,
  Send as SendMessageIcon,
  Settings as SettingsIcon,
  Share as ShareIcon,
  SkipNext as SkipNextIcon,
  StarBorder as RatingIcon,
  Timelapse as StartedAtIcon,
  Timer as ReliabilityIcon,
  Warning as WarningIcon,
} from "@material-ui/icons";

type FontSize = "inherit" | "large" | "medium" | "small";

interface CustomIcon {
  fontSize?: FontSize;
}

export const OrdersOpenIcon = () => (
  <SvgIcon>
    <path d="M9,0 C10.3,0 11.4,0.84 11.82,2 L11.82,2 L16,2 C17.1045695,2 18,2.8954305 18,4 L18,4 L18,18 C18,19.1045695 17.1045695,20 16,20 L16,20 L2,20 C0.8954305,20 0,19.1045695 0,18 L0,18 L0,4 C0,2.8954305 0.8954305,2 2,2 L2,2 L6.18,2 C6.6,0.84 7.7,0 9,0 Z M5,14 L3,14 L3,16 L5,16 L5,14 Z M15,14 L7,14 L7,16 L15,16 L15,14 Z M5,6 L3,6 L3,12 L5,12 L5,6 Z M15,10 L7,10 L7,12 L15,12 L15,10 Z M15,6 L7,6 L7,8 L15,8 L15,6 Z M9,2 C8.44771525,2 8,2.44771525 8,3 C8,3.55228475 8.44771525,4 9,4 C9.55228475,4 10,3.55228475 10,3 C10,2.44771525 9.55228475,2 9,2 Z"></path>
  </SvgIcon>
);

export const OrdersConfirmedIcon = React.forwardRef<SVGSVGElement>(
  (props, ref) => (
    <SvgIcon ref={ref} {...props}>
      <path
        d="M9,0 C10.3,0 11.4,0.84 11.82,2 L11.82,2 L16,2 C17.1045695,2 18,2.8954305 18,4 L18,4 L18,18 C18,19.1045695 17.1045695,20 16,20 L16,20 L2,20 C0.8954305,20 0,19.1045695 0,18 L0,18 L0,4 C0,2.8954305 0.8954305,2 2,2 L2,2 L6.18,2 C6.6,0.84 7.7,0 9,0 Z M13.4347826,7 L7.70608696,12.7391304 L4.56521739,9.60869565 L3,11.173913 L7.70608696,15.8695652 L15,8.56521739 L13.4347826,7 Z M9,2 C8.44771525,2 8,2.44771525 8,3 C8,3.55228475 8.44771525,4 9,4 C9.55228475,4 10,3.55228475 10,3 C10,2.44771525 9.55228475,2 9,2 Z"
        id="order_confirmed"
      ></path>
    </SvgIcon>
  )
);

export const WantsDrawIcon = React.forwardRef<SVGSVGElement>((props, ref) => (
  <SvgIcon ref={ref} {...props}>
    <path d="M2.98188996,2.24133335 L3.88833335,3.148 L3.8,3.23743687 L20.7705627,20.2079996 L20.8593333,20.119 L21.3666663,20.6261097 L20.0261097,21.9666663 L14.4292636,16.3704135 C14.0775047,16.5664056 13.6995541,16.7212717 13.301866,16.8285576 L13,16.9 L13,19.08 C15.489899,19.4617845 15.9132657,21.2212572 15.9852522,21.8085585 L16,22 L8,22 L8.00876781,21.8621764 C8.05962111,21.354459 8.40542355,19.5936066 10.7568801,19.1228674 L11,19.08 L11,16.9 C9.11538462,16.5153846 7.61908284,15.0767751 7.15117205,13.224249 L7.1,13 L4,13 C2.95,13 2.0822314,12.1799587 2.00551277,11.1486946 L2,11 L2,4 L2.06033335,4 L1.64133335,3.58188996 L2.98188996,2.24133335 Z M17,2 L17,4 L22,4 L22,11 C22,12.05 21.1799587,12.9177686 20.1486946,12.9944872 L20,13 L16.9,13 C16.852859,13.2309911 16.7898842,13.4561487 16.7122542,13.6742943 L6.99933335,3.962 L7,2 L17,2 Z M4.06033335,6 L4,6 L4,11 L7,11 L6.99933335,8.939 L4.06033335,6 Z M20,6 L17,6 L17,11 L20,11 L20,6 Z"></path>
  </SvgIcon>
));

export const NoOrdersGivenIcon = React.forwardRef<SVGSVGElement>(
  (props, ref) => (
    <SvgIcon ref={ref} {...props}>
      <path d="M2.98188996,2.24133335 L21.3666663,20.6261097 L20.0261097,21.9666663 L19.0573333,20.998 L19,21 L5,21 C3.95,21 3.0822314,20.1799587 3.00551277,19.1486946 L3,19 L3,5 L3.00233335,4.942 L1.64133335,3.58188996 L2.98188996,2.24133335 Z M12,1 C13.235,1 14.2895,1.7581 14.75196,2.828465 L14.82,3 L19,3 C20.05,3 20.9177686,3.82004132 20.9944872,4.85130541 L21,5 L21,17.963 L16.037,13 L17,13 L17,11 L14.037,11 L12.037,9 L17,9 L17,7 L10.037,7 L6.037,3 L9.18,3 C9.579,1.898 10.5917,1.0848 11.80656,1.006235 L12,1 Z M13.0593333,15 L7,15 L7,17 L15.0593333,17 L13.0593333,15 Z M11.0593333,13 L9.06033335,11 L7,11 L7,13 L11.0593333,13 Z M12,3 C11.45,3 11,3.45 11,4 C11,4.55 11.45,5 12,5 C12.55,5 13,4.55 13,4 C13,3.45 12.55,3 12,3 Z"></path>
    </SvgIcon>
  )
);

export const ChatDisabledIcon = React.forwardRef<SVGSVGElement, CustomIcon>(
  (props, ref) => (
    <SvgIcon ref={ref} {...props}>
      <g
        id="Artboard"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g>
          <polygon id="Path" points="0 0 24 0 24 24 0 24"></polygon>
          <path
            d="M2.4,2.614 L20.5847763,20.7989899 L20.598,20.784 L20.7989899,20.9842712 L19.3847763,22.3984848 L14.986,18 L6,18 L2,22 L2.008,5.022 L1,4.0137085 L2.4,2.614 Z M20,2 C21.05,2 21.9177686,2.82004132 21.9944872,3.85130541 L22,4 L22,16 C22,16.9134058 21.3794387,17.6889091 20.539101,17.925725 L16.614,14 L18,14 L18,12 L14.614,12 L13.614,11 L18,11 L18,9 L11.614,9 L10.614,8 L18,8 L18,6 L8.614,6 L4.614,2 L20,2 Z M8.987,12 L6,12 L6,14 L10.986,14 L8.987,12 Z M6,9.013 L6,11 L7.987,11 L6,9.013 Z"
            id="Combined-Shape"
            fill="#000000"
            fillRule="nonzero"
          ></path>
        </g>
      </g>
    </SvgIcon>
  )
);
