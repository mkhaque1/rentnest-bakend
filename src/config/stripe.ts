import Stripe from 'stripe';
import config from './index';

const stripe = new Stripe(config.stripe_secret_key);

export default stripe;
