import type { Language } from '../types/learning';

/**
 * Human-readable milestones shown next to a module in Module Picker.
 * Only edit these labels when the meaning of a STEP changes; per-module
 * progress still comes exclusively from CURRENT_STEP in master.json.
 *
 * STEP 8 is reserved in the current workflow. STEP 12A is a legacy
 * progress value for the VI-to-EN clone, now numbered STEP 13.
 */
export const MODULE_STEP_TOOLTIPS: Record<string, Record<Language, string>> = {
  '1': {
    vi: 'Đã tạo tab Google Sheets cho module và ghi nhận đường dẫn module.',
    en: 'Created the module Google Sheets tab and recorded its module location.',
  },
  '2': {
    vi: 'Đã tạo Roadmap, Reference và phần giới thiệu module.',
    en: 'Created the module Roadmap, Reference, and Introduction.',
  },
  '3': {
    vi: 'Đã xây dựng menu học tập hai cấp cho module.',
    en: 'Created the module’s two-level learning menu.',
  },
  '4': {
    vi: 'Đã tạo nội dung Knowledge Markdown cho các bài học còn trống.',
    en: 'Created Knowledge Markdown for previously empty lessons.',
  },
  '5': {
    vi: 'Đã rà soát Knowledge, thiết lập Difficulty, isImportant, Summary và Java skeleton; nhập nội dung vào module.',
    en: 'Reviewed Knowledge, set Difficulty and isImportant, created Summary and Java skeleton, and imported module content.',
  },
  '6': {
    vi: 'Đã xây dựng và kiểm thử API theo từng chương, đồng thời sinh Swagger skeleton.',
    en: 'Built and tested chapter APIs and generated the Swagger skeleton.',
  },
  '7': {
    vi: 'Đã biên soạn, kiểm tra và hợp nhất tài liệu Swagger VI/EN cho các API.',
    en: 'Authored, validated, and merged Vietnamese and English Swagger API documentation.',
  },
  '8': {
    vi: 'Bước dự phòng hoặc trạng thái cũ; chưa có mô tả chính thức trong quy trình hiện tại.',
    en: 'Reserved or legacy step; no official description in the current workflow.',
  },
  '9': {
    vi: 'Đã tạo, chuẩn hóa và nhập bộ câu hỏi phỏng vấn cho từng chương.',
    en: 'Created, normalized, and imported chapter interview questions and answers.',
  },
  '10': {
    vi: 'Đã tạo, chuẩn hóa và nhập bộ câu hỏi Quiz cho từng chương.',
    en: 'Created, normalized, and imported chapter quizzes.',
  },
  '11': {
    vi: 'Đã liên kết Knowledge, API, Quiz, Interview và Roadmap.',
    en: 'Linked Knowledge, APIs, Quizzes, Interviews, and Roadmap content.',
  },
  '12': {
    vi: 'Đã xuất bản Excel offline của tab module tiếng Việt.',
    en: 'Exported an offline Excel snapshot of the Vietnamese module tab.',
  },
  '12A': {
    vi: 'Bước 13 (mã cũ 12A): Đã sao chép và kiểm tra cấu trúc nội dung tiếng Việt sang tiếng Anh.',
    en: 'Step 13 (legacy 12A): Cloned and validated the Vietnamese content structure in English.',
  },
  '13': {
    vi: 'Đã sao chép và kiểm tra cấu trúc nội dung tiếng Việt sang tiếng Anh.',
    en: 'Cloned and validated the Vietnamese content structure in English.',
  },
  '14': {
    vi: 'Đã dịch nội dung VI sang EN và nghiệm thu bản dịch.',
    en: 'Translated Vietnamese module content into English and validated the translations.',
  },
  '15': {
    vi: 'Đã tạo và xác minh tab Google Sheets tiếng Anh cùng bản Excel EN.',
    en: 'Published and verified the English Google Sheets tab and Excel snapshot.',
  },
  FINAL: {
    vi: 'Đã hoàn tất QA, commit và push nội dung của module.',
    en: 'Completed quality checks, committed, and pushed the module content.',
  },
};

export function getModuleStepTooltip(step: string | undefined, language: Language): string | null {
  if (!step || step === '0') return null;

  return MODULE_STEP_TOOLTIPS[step]?.[language]
    ?? (language === 'vi'
      ? 'Chưa có mô tả chính thức cho bước này.'
      : 'No official description is available for this step.');
}
