--
-- PostgreSQL database dump
--

\restrict gj8Kkxl7bz77pGTiDoXeSafYVMIZJ18tfJCztZKS4rV57fYfQQocLNk4G7M2axc

-- Dumped from database version 16.14
-- Dumped by pg_dump version 16.14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: RoleOfUser; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."RoleOfUser" AS ENUM (
    'Membre'
);


--
-- Name: StatusOfConversation; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."StatusOfConversation" AS ENUM (
    'Open',
    'Close'
);


--
-- Name: Time; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Time" AS ENUM (
    'Morning',
    'Afternoon'
);


--
-- Name: dayInAWeek; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."dayInAWeek" AS ENUM (
    'Lundi',
    'Mardi',
    'Mercredi',
    'Jeudi',
    'Vendredi',
    'Samedi',
    'Dimanche'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: available; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.available (
    id integer NOT NULL,
    day public."dayInAWeek" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    time_slot public."Time" NOT NULL
);


--
-- Name: available_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.available_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: available_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.available_id_seq OWNED BY public.available.id;


--
-- Name: category; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.category (
    id integer NOT NULL,
    name text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    slug text NOT NULL
);


--
-- Name: category_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.category_id_seq OWNED BY public.category.id;


--
-- Name: conversation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.conversation (
    id integer NOT NULL,
    status public."StatusOfConversation" DEFAULT 'Open'::public."StatusOfConversation" NOT NULL,
    title text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: conversation_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.conversation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: conversation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.conversation_id_seq OWNED BY public.conversation.id;


--
-- Name: evaluation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.evaluation (
    id integer NOT NULL,
    comments text,
    score integer NOT NULL,
    evaluator_id integer NOT NULL,
    evaluated_id integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: evaluation_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.evaluation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: evaluation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.evaluation_id_seq OWNED BY public.evaluation.id;


--
-- Name: follow; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.follow (
    id integer NOT NULL,
    followed_id integer NOT NULL,
    follower_id integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: follow_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.follow_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: follow_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.follow_id_seq OWNED BY public.follow.id;


--
-- Name: message; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.message (
    id integer NOT NULL,
    sender_id integer NOT NULL,
    receiver_id integer NOT NULL,
    content text NOT NULL,
    conversation_id integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: message_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.message_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: message_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.message_id_seq OWNED BY public.message.id;


--
-- Name: refresh_token; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.refresh_token (
    id integer NOT NULL,
    token text NOT NULL,
    user_id integer NOT NULL,
    expire_at timestamp(3) without time zone NOT NULL,
    issued_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: refresh_token_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.refresh_token_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: refresh_token_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.refresh_token_id_seq OWNED BY public.refresh_token.id;


--
-- Name: role; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.role (
    id integer NOT NULL,
    name public."RoleOfUser" DEFAULT 'Membre'::public."RoleOfUser" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: role_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.role_id_seq OWNED BY public.role.id;


--
-- Name: skill; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.skill (
    id integer NOT NULL,
    name text NOT NULL,
    category_id integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: skill_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.skill_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: skill_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.skill_id_seq OWNED BY public.skill.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    firstname text NOT NULL,
    lastname text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    address text,
    postal_code integer,
    city text,
    age integer,
    description text,
    role_id integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    avatar_url text
);


--
-- Name: user_has_available; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_has_available (
    user_id integer NOT NULL,
    available_id integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: user_has_conversation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_has_conversation (
    user_id integer NOT NULL,
    conversation_id integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: user_has_interest; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_has_interest (
    user_id integer NOT NULL,
    skill_id integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: user_has_skill; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_has_skill (
    user_id integer NOT NULL,
    skill_id integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: available id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.available ALTER COLUMN id SET DEFAULT nextval('public.available_id_seq'::regclass);


--
-- Name: category id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category ALTER COLUMN id SET DEFAULT nextval('public.category_id_seq'::regclass);


--
-- Name: conversation id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversation ALTER COLUMN id SET DEFAULT nextval('public.conversation_id_seq'::regclass);


--
-- Name: evaluation id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evaluation ALTER COLUMN id SET DEFAULT nextval('public.evaluation_id_seq'::regclass);


--
-- Name: follow id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.follow ALTER COLUMN id SET DEFAULT nextval('public.follow_id_seq'::regclass);


--
-- Name: message id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message ALTER COLUMN id SET DEFAULT nextval('public.message_id_seq'::regclass);


--
-- Name: refresh_token id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_token ALTER COLUMN id SET DEFAULT nextval('public.refresh_token_id_seq'::regclass);


--
-- Name: role id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role ALTER COLUMN id SET DEFAULT nextval('public.role_id_seq'::regclass);


--
-- Name: skill id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skill ALTER COLUMN id SET DEFAULT nextval('public.skill_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Name: available available_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.available
    ADD CONSTRAINT available_pkey PRIMARY KEY (id);


--
-- Name: category category_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (id);


--
-- Name: conversation conversation_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversation
    ADD CONSTRAINT conversation_pkey PRIMARY KEY (id);


--
-- Name: evaluation evaluation_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evaluation
    ADD CONSTRAINT evaluation_pkey PRIMARY KEY (id);


--
-- Name: follow follow_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.follow
    ADD CONSTRAINT follow_pkey PRIMARY KEY (id);


--
-- Name: message message_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_pkey PRIMARY KEY (id);


--
-- Name: refresh_token refresh_token_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_token
    ADD CONSTRAINT refresh_token_pkey PRIMARY KEY (id);


--
-- Name: role role_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_pkey PRIMARY KEY (id);


--
-- Name: skill skill_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skill
    ADD CONSTRAINT skill_pkey PRIMARY KEY (id);


--
-- Name: user_has_available user_has_available_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_has_available
    ADD CONSTRAINT user_has_available_pkey PRIMARY KEY (user_id, available_id);


--
-- Name: user_has_conversation user_has_conversation_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_has_conversation
    ADD CONSTRAINT user_has_conversation_pkey PRIMARY KEY (user_id, conversation_id);


--
-- Name: user_has_interest user_has_interest_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_has_interest
    ADD CONSTRAINT user_has_interest_pkey PRIMARY KEY (user_id, skill_id);


--
-- Name: user_has_skill user_has_skill_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_has_skill
    ADD CONSTRAINT user_has_skill_pkey PRIMARY KEY (user_id, skill_id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: category_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX category_slug_key ON public.category USING btree (slug);


--
-- Name: evaluation_evaluator_id_evaluated_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX evaluation_evaluator_id_evaluated_id_key ON public.evaluation USING btree (evaluator_id, evaluated_id);


--
-- Name: follow_followed_id_follower_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX follow_followed_id_follower_id_key ON public.follow USING btree (followed_id, follower_id);


--
-- Name: refresh_token_token_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX refresh_token_token_key ON public.refresh_token USING btree (token);


--
-- Name: refresh_token_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX refresh_token_user_id_idx ON public.refresh_token USING btree (user_id);


--
-- Name: user_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX user_email_key ON public."user" USING btree (email);


--
-- Name: evaluation evaluation_evaluated_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evaluation
    ADD CONSTRAINT evaluation_evaluated_id_fkey FOREIGN KEY (evaluated_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: evaluation evaluation_evaluator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evaluation
    ADD CONSTRAINT evaluation_evaluator_id_fkey FOREIGN KEY (evaluator_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: follow follow_followed_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.follow
    ADD CONSTRAINT follow_followed_id_fkey FOREIGN KEY (followed_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: follow follow_follower_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.follow
    ADD CONSTRAINT follow_follower_id_fkey FOREIGN KEY (follower_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: message message_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversation(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: message message_receiver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: message message_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: refresh_token refresh_token_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_token
    ADD CONSTRAINT refresh_token_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: skill skill_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skill
    ADD CONSTRAINT skill_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.category(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_has_available user_has_available_available_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_has_available
    ADD CONSTRAINT user_has_available_available_id_fkey FOREIGN KEY (available_id) REFERENCES public.available(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_has_available user_has_available_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_has_available
    ADD CONSTRAINT user_has_available_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_has_conversation user_has_conversation_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_has_conversation
    ADD CONSTRAINT user_has_conversation_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversation(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_has_conversation user_has_conversation_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_has_conversation
    ADD CONSTRAINT user_has_conversation_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_has_interest user_has_interest_skill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_has_interest
    ADD CONSTRAINT user_has_interest_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.skill(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_has_interest user_has_interest_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_has_interest
    ADD CONSTRAINT user_has_interest_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_has_skill user_has_skill_skill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_has_skill
    ADD CONSTRAINT user_has_skill_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.skill(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_has_skill user_has_skill_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_has_skill
    ADD CONSTRAINT user_has_skill_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user user_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.role(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict gj8Kkxl7bz77pGTiDoXeSafYVMIZJ18tfJCztZKS4rV57fYfQQocLNk4G7M2axc

