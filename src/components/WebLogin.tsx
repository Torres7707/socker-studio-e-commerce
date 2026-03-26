import { useState } from 'react';
import './WebLogin.css';

function WebLogin() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		// Simulate login process
		setTimeout(() => {
			setIsLoading(false);
			alert(`登录成功！欢迎, ${username}`);
		}, 2000);
	};

	return (
		<div className="web-login-container">
			{/* Background Effects */}
			<div className="bg-grid"></div>
			<div className="bg-gradient"></div>
			<div className="floating-elements">
				<div className="hexagon hex-1"></div>
				<div className="hexagon hex-2"></div>
				<div className="hexagon hex-3"></div>
				<div className="hexagon hex-4"></div>
				<div className="data-stream stream-1"></div>
				<div className="data-stream stream-2"></div>
			</div>

			{/* Left Side - Branding */}
			<div className="branding-section">
				<div className="brand-content">
					<div className="logo-area">
						<div className="logo-icon">
							<div className="logo-ring ring-1"></div>
							<div className="logo-ring ring-2"></div>
							<div className="logo-ring ring-3"></div>
							<div className="logo-core"></div>
						</div>
						<h1 className="brand-name">NEXUS</h1>
						<p className="brand-tagline">下一代智能系统平台</p>
					</div>

					<div className="features-list">
						<div className="feature-item">
							<div className="feature-icon">
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								>
									<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
								</svg>
							</div>
							<div className="feature-text">
								<h3>企业级安全</h3>
								<p>端到端加密保护</p>
							</div>
						</div>
						<div className="feature-item">
							<div className="feature-icon">
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								>
									<circle cx="12" cy="12" r="10" />
									<polyline points="12 6 12 12 16 14" />
								</svg>
							</div>
							<div className="feature-text">
								<h3>实时同步</h3>
								<p>毫秒级数据同步</p>
							</div>
						</div>
						<div className="feature-item">
							<div className="feature-icon">
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								>
									<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
								</svg>
							</div>
							<div className="feature-text">
								<h3>极速性能</h3>
								<p>分布式架构支持</p>
							</div>
						</div>
					</div>

					<div className="tech-info">
						<div className="status-indicator">
							<span className="status-dot"></span>
							<span>系统状态: 正常运行</span>
						</div>
						<div className="version-info">v3.2.1 | 更新于 2024.01.15</div>
					</div>
				</div>
			</div>

			{/* Right Side - Login Form */}
			<div className="login-section">
				<div className="login-box">
					<div className="login-header">
						<h2>系统登录</h2>
						<p>请输入您的凭证以访问系统</p>
						<div className="header-line">
							<div className="line-segment"></div>
							<div className="line-glow"></div>
						</div>
					</div>

					<form onSubmit={handleSubmit} className="login-form">
						<div className="form-group">
							<label htmlFor="username">
								<span className="label-icon">
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
									>
										<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
										<circle cx="12" cy="7" r="4" />
									</svg>
								</span>
								用户名
							</label>
							<div className="input-container">
								<input
									type="text"
									id="username"
									placeholder="请输入用户名"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									required
								/>
								<div className="input-border"></div>
							</div>
						</div>

						<div className="form-group">
							<label htmlFor="password">
								<span className="label-icon">
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
									>
										<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
										<path d="M7 11V7a5 5 0 0 1 10 0v4" />
									</svg>
								</span>
								密码
							</label>
							<div className="input-container">
								<input
									type="password"
									id="password"
									placeholder="请输入密码"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
								<div className="input-border"></div>
							</div>
						</div>

						<div className="form-options">
							<label className="remember-me">
								<input type="checkbox" />
								<span className="custom-checkbox"></span>
								<span>记住登录状态</span>
							</label>
							<a href="#" className="forgot-password">
								忘记密码?
							</a>
						</div>

						<button type="submit" className="submit-btn" disabled={isLoading}>
							<span className="btn-content">
								{isLoading ? (
									<>
										<span className="loading-spinner"></span>
										<span>验证中...</span>
									</>
								) : (
									<>
										<span>登录系统</span>
										<svg
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
										>
											<path d="M5 12h14M12 5l7 7-7 7" />
										</svg>
									</>
								)}
							</span>
							<div className="btn-shine"></div>
						</button>
					</form>

					<div className="login-footer">
						<div className="divider">
							<span>其他登录方式</span>
						</div>
						<div className="alt-login-methods">
							<button className="alt-btn sso-btn">
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								>
									<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
									<circle cx="9" cy="7" r="4" />
									<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
									<path d="M16 3.13a4 4 0 0 1 0 7.75" />
								</svg>
								SSO 单点登录
							</button>
							<button className="alt-btn api-btn">
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								>
									<polyline points="16 18 22 12 16 6" />
									<polyline points="8 6 2 12 8 18" />
								</svg>
								API Key
							</button>
						</div>
						<p className="terms">
							登录即表示您同意我们的
							<a href="#">服务条款</a>和<a href="#">隐私政策</a>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default WebLogin;
