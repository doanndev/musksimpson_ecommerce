import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react';

import bag from './svg/bag.svg';
import bell from './svg/bell.svg';
import camera from './svg/camera.svg';
import card_cursor from './svg/card_cursor.svg';
import chart_rates from './svg/chart_rates.svg';
import chatbot from './svg/chatbot.svg';
import clear from './svg/clear.svg';
import close from './svg/close.svg';
import comment from './svg/comment.svg';
import credit_card from './svg/credit_card.svg';
import data_browser from './svg/data_browser.svg';
import data_code from './svg/data_code.svg';
import email from './svg/email.svg';
import eye from './svg/eye.svg';
import facebook from './svg/facebook.svg';
import github from './svg/github.svg';
import google from './svg/google.svg';
import headphone from './svg/headphone.svg';
import heart from './svg/heart.svg';
import home from './svg/home.svg';
import add from './svg/icons-add.svg';
import remove from './svg/icons-remove.svg';
import instagram from './svg/instagram.svg';
import link from './svg/link.svg';
import linkedin from './svg/linkedin.svg';
import location from './svg/location.svg';
import look from './svg/look.svg';
import messenger from './svg/messenger.svg';
import microsoft from './svg/microsoft.svg';
import multiStar from './svg/multi-star.svg';
import network from './svg/network.svg';
import phone from './svg/phone.svg';
import pinterest from './svg/pinterest.svg';
import question from './svg/question.svg';
import send from './svg/send.svg';
import shield from './svg/shield.svg';
import shopping from './svg/shopping.svg';
import star from './svg/star.svg';
import star_half from './svg/star_half.svg';
import trash from './svg/trash.svg';
import user from './svg/user.svg';
import world_transfer from './svg/world_transfer.svg';
import x from './svg/x.svg';

const IconList = {
  google,
  microsoft,
  github,
  x,
  facebook,
  instagram,
  linkedin,
  multiStar,
  email,
  data_code,
  data_browser,
  network,
  card_cursor,
  chart_rates,
  world_transfer,
  close,
  send,
  question,
  star,
  add,
  remove,
  trash,
  home,
  user,
  bell,
  shopping,
  bag,
  location,
  credit_card,
  comment,
  eye,
  heart,
  star_half,
  headphone,
  camera,
  look,
  shield,
  phone,
  link,
  messenger,
  pinterest,
  clear,
  chatbot,
};

type SVGAttributes = Partial<SVGProps<SVGSVGElement>>;
type ComponentAttributes = RefAttributes<SVGSVGElement> & SVGAttributes;
interface IconProps extends ComponentAttributes {
  size?: string | number;
  absoluteStrokeWidth?: boolean;
}

export type Icon = ForwardRefExoticComponent<IconProps>;

export const Icons = IconList as Record<keyof typeof IconList, Icon>;
