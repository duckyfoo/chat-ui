export interface ConvSidebar {
	id: string;
	title: string;
	updatedAt: Date;
	lastActivityAt: Date;
	model?: string;
	assistantId?: string;
	avatarHash?: string;
	shared: boolean;
	excerpt?: string;
}
