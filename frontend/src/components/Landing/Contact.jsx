import { useEffect, useRef, useState } from "react";
import { sendContactMessage, subscribeNewsletter } from "../../api/publicApi";
import { useToast } from "../../context/ToastContext";
import { isValidEmail } from "../../util/validation";
import "../../styles/landing/contact.css";
import "../../styles/responsive.css"

const MAX_MESSAGE = 1000;