export type Service = {
  id: string | number;
  title: string;
  description: string;
  image: string;
  slug: string;
  details?: JSX.Element;
};

export interface Program extends Service {
  subtitle_header?: string;
  subtitle_body?: string;
  is_active?: boolean;
}
