/// SoulCraft Social Recovery Wallet Smart Contract
/// This module implements a social recovery wallet where users can recover their accounts
/// through trusted guardians (friends/family)
module soulcraft::wallet {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::vector;

    /// Error codes
    const ENotOwner: u64 = 1;
    const ENotGuardian: u64 = 2;
    const ENoRecoveryInProgress: u64 = 3;
    const ERecoveryAlreadyInProgress: u64 = 4;
    const EInsufficientApprovals: u64 = 5;
    const EGuardianAlreadyExists: u64 = 6;
    const EAlreadyApproved: u64 = 7;

    /// The main wallet struct that holds all the state
    struct SoulCraftWallet has key, store {
        id: UID,
        /// Current owner of the wallet
        owner: address,
        /// List of guardian addresses who can help with recovery
        guardians: vector<address>,
        /// Flag indicating if a recovery process is currently active
        recovery_in_progress: bool,
        /// Proposed new owner during recovery
        new_owner_proposal: address,
        /// List of guardians who have approved the current recovery
        approvals: vector<address>,
        /// Minimum number of guardian approvals needed (for demo: 1)
        threshold: u64,
    }

    /// Event emitted when a wallet is created
    struct WalletCreated has copy, drop {
        wallet_id: object::ID,
        owner: address,
    }

    /// Event emitted when a guardian is added
    struct GuardianAdded has copy, drop {
        wallet_id: object::ID,
        guardian: address,
    }

    /// Event emitted when recovery is initiated
    struct RecoveryInitiated has copy, drop {
        wallet_id: object::ID,
        new_owner_proposal: address,
    }

    /// Event emitted when a guardian approves recovery
    struct RecoveryApproved has copy, drop {
        wallet_id: object::ID,
        guardian: address,
    }

    /// Event emitted when recovery is finalized
    struct RecoveryFinalized has copy, drop {
        wallet_id: object::ID,
        old_owner: address,
        new_owner: address,
    }

    /// Initialize and create a new SoulCraft wallet
    /// The transaction sender becomes the initial owner
    public fun init_wallet(ctx: &mut TxContext): SoulCraftWallet {
        let sender = tx_context::sender(ctx);
        let wallet = SoulCraftWallet {
            id: object::new(ctx),
            owner: sender,
            guardians: vector::empty<address>(),
            recovery_in_progress: false,
            new_owner_proposal: @0x0,
            approvals: vector::empty<address>(),
            threshold: 1, // For demo purposes, only 1 approval needed
        };

        sui::event::emit(WalletCreated {
            wallet_id: object::id(&wallet),
            owner: sender,
        });

        wallet
    }

    /// Add a new guardian to the wallet
    /// Only the current owner can add guardians
    public fun add_guardian(
        wallet: &mut SoulCraftWallet, 
        guardian_address: address, 
        ctx: &TxContext
    ) {
        let sender = tx_context::sender(ctx);
        assert!(wallet.owner == sender, ENotOwner);
        assert!(!vector::contains(&wallet.guardians, &guardian_address), EGuardianAlreadyExists);
        
        vector::push_back(&mut wallet.guardians, guardian_address);
        
        sui::event::emit(GuardianAdded {
            wallet_id: object::id(wallet),
            guardian: guardian_address,
        });
    }

    /// Initiate the recovery process with a new proposed owner
    /// Anyone can initiate recovery, but guardians must approve
    public fun initiate_recovery(
        wallet: &mut SoulCraftWallet, 
        new_owner_address: address, 
        _ctx: &TxContext
    ) {
        assert!(!wallet.recovery_in_progress, ERecoveryAlreadyInProgress);
        
        wallet.recovery_in_progress = true;
        wallet.new_owner_proposal = new_owner_address;
        wallet.approvals = vector::empty<address>();
        
        sui::event::emit(RecoveryInitiated {
            wallet_id: object::id(wallet),
            new_owner_proposal: new_owner_address,
        });
    }

    /// Approve the current recovery process
    /// Only guardians can approve, and each guardian can only approve once
    public fun approve_recovery(wallet: &mut SoulCraftWallet, ctx: &TxContext) {
        let sender = tx_context::sender(ctx);
        assert!(wallet.recovery_in_progress, ENoRecoveryInProgress);
        assert!(vector::contains(&wallet.guardians, &sender), ENotGuardian);
        assert!(!vector::contains(&wallet.approvals, &sender), EAlreadyApproved);
        
        vector::push_back(&mut wallet.approvals, sender);
        
        sui::event::emit(RecoveryApproved {
            wallet_id: object::id(wallet),
            guardian: sender,
        });
    }

    /// Finalize the recovery process if enough approvals are received
    /// Changes the owner and resets recovery state
    public fun finalize_recovery(wallet: &mut SoulCraftWallet, _ctx: &TxContext) {
        assert!(wallet.recovery_in_progress, ENoRecoveryInProgress);
        assert!(vector::length(&wallet.approvals) >= wallet.threshold, EInsufficientApprovals);
        
        let old_owner = wallet.owner;
        wallet.owner = wallet.new_owner_proposal;
        wallet.recovery_in_progress = false;
        wallet.new_owner_proposal = @0x0;
        wallet.approvals = vector::empty<address>();
        
        sui::event::emit(RecoveryFinalized {
            wallet_id: object::id(wallet),
            old_owner,
            new_owner: wallet.owner,
        });
    }

    /// Get wallet information (read-only functions)
    public fun get_owner(wallet: &SoulCraftWallet): address {
        wallet.owner
    }

    public fun get_guardians(wallet: &SoulCraftWallet): &vector<address> {
        &wallet.guardians
    }

    public fun is_recovery_in_progress(wallet: &SoulCraftWallet): bool {
        wallet.recovery_in_progress
    }

    public fun get_new_owner_proposal(wallet: &SoulCraftWallet): address {
        wallet.new_owner_proposal
    }

    public fun get_approvals(wallet: &SoulCraftWallet): &vector<address> {
        &wallet.approvals
    }

    public fun get_threshold(wallet: &SoulCraftWallet): u64 {
        wallet.threshold
    }

    /// Transfer the wallet object to the owner
    public fun create_and_transfer_wallet(ctx: &mut TxContext) {
        let wallet = init_wallet(ctx);
        transfer::transfer(wallet, tx_context::sender(ctx));
    }
}
