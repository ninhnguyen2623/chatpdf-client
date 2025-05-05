import { Collapse } from 'antd';
export default function CollapseInfo() {
    const ContextSubs = [
        {
            label: "ChatPDF là gì và nó có thể giúp mình thế nào?",
            text: "ChatPDF mang sức mạnh của AI hội thoại đến tài liệu của bạn, cho phép bạn trò chuyện với PDF dễ dàng như khi dùng ChatGPT. Dù bạn đang học tập, nghiên cứu hay phân tích dữ liệu, nền tảng này giúp bạn hiểu và trích xuất thông tin trong vài giây, nhờ công nghệ AI PDF mới nhất."

        },
        {
            label: "ChatPDF có miễn phí không?",
            text: "Hoàn toàn! Chúng tôi cung cấp gói miễn phí cho phép bạn phân tích 2 tài liệu mỗi ngày. Với những người dùng cần nhiều hơn, gói ChatPDF Plus mang lại khả năng phân tích tài liệu không giới hạn và nhiều tính năng nâng cao."

        },
        {
            label: "Công nghệ AI của ChatPDF hoạt động như thế nào?",
            text: "ChatPDF sử dụng AI tiên tiến để xây dựng một sơ đồ toàn diện về nội dung và ý nghĩa của tài liệu. Khi bạn trò chuyện với PDF, hệ thống nhanh chóng xác định thông tin liên quan và tạo ra câu trả lời rõ ràng, chính xác - kèm trích dẫn giúp bạn kiểm chứng và tìm hiểu thêm."
        },
        {
            label: "ChatPDF có hỗ trợ các loại tệp khác ngoài PDF không?",
            text: "Có, ChatPDF hỗ trợ ngày càng nhiều định dạng tài liệu bao gồm PDF (.pdf), Word (.doc, .docx), PowerPoint (.ppt, .pptx), Markdown (.md) và tệp văn bản (.txt). Từ bài nghiên cứu khoa học đến bản thuyết trình công ty, tài liệu pháp lý - tất cả đều trên một nền tảng AI cho tài liệu."
        },
        {
            lable: "Mình có cần tạo tài khoản để dùng ChatPDF không?",
            text: "Không, bạn có thể bắt đầu ngay! ChatPDF miễn phí để dùng thử và không bắt buộc tài khoản. Mặc dù tạo tài khoản miễn phí sẽ mở khóa thêm tính năng như lưu lịch sử và chat với nhiều tài liệu, bạn vẫn có thể trải nghiệm các chức năng chính mạnh mẽ của ChatPDF ngay."
        },
        {
            lable: "Mình có thể trò chuyện với nhiều tệp cùng lúc không?",
            text: "Được chứ! Chỉ cần tạo một thư mục, thêm tệp của bạn, và ChatPDF sẽ hiểu mối liên hệ giữa các tài liệu. Đặt câu hỏi tham chiếu nhiều nguồn, so sánh nội dung hoặc tìm kết nối giữa các tài liệu khác nhau - chỉ trong một cuộc trò chuyện."
        },
        {
            lable: "Dữ liệu của mình có an toàn và bảo mật không?",
            text: "Chúng tôi áp dụng các tiêu chuẩn bảo mật cao nhất. Tài liệu của bạn được bảo vệ bằng mã hóa SSL trong quá trình truyền và vẫn được mã hóa khi lưu trữ. Nhà cung cấp lưu trữ được chứng nhận SOC2 Type II của chúng tôi đảm bảo mức độ bảo mật doanh nghiệp, trong khi bạn vẫn có toàn quyền kiểm soát dữ liệu - với khả năng xóa tài liệu bất cứ lúc nào."
        },
        {
            lable: "Mình có thể dùng ChatPDF bằng các ngôn ngữ khác nhau không?",
            text: "Có! ChatPDF hỗ trợ hoàn toàn đa ngôn ngữ - bạn có thể tải tài liệu bằng bất kỳ ngôn ngữ nào và trò chuyện bằng ngôn ngữ ưa thích. Thậm chí bạn có thể tải một tài liệu bằng một ngôn ngữ và đặt câu hỏi bằng một ngôn ngữ khác, rất phù hợp cho nghiên cứu quốc tế. Bạn có thể chuyển đổi bất kỳ lúc nào bằng cách nhờ ChatPDF."
        },
        {
            lable: "ChatPDF có dùng được trên mọi thiết bị không?",
            text: "Chắc chắn rồi! ChatPDF được thiết kế để tương thích với tất cả thiết bị. Bạn có thể truy cập tài liệu từ máy tính ở chỗ làm, máy tính bảng khi lên lớp hoặc điện thoại khi di chuyển - tất cả những gì bạn cần là một trình duyệt web."
        },
    ]
    return (
        <div className='mt-20 w-[67%]'>
            <h3 className='text-center mb-20 text-3xl font-medium'>Các câu hỏi thường gặp</h3>
            {ContextSubs.map((item, index) => (
                <div className="mt-3">
                    <Collapse
                        size="large"
                        key={index}
                        items={[{ key: '1', label: `${item.lable}`, children: <p>{item.text}</p> }]}
                    />
                </div>
            ))}

        </div>
    )
}
